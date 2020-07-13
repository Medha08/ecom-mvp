const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  console.log(req.body, "req.body");

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ err });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({ user });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "User with the email does not exist. Please signup",
      });
    }
    // if found check email pass to match

    // auth method in model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email Password don't match",
      });
    }

    // generate signed token with user id and pass
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);
    // persist token as "mp" in cookie with expiery date
    res.cookie("mp", token, { expire: new Date() + 9999 });

    // return res with user and token to frontend client

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("mp");
  res.json({ message: "Signout Successful!" });
};

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

exports.isAuth = (req, res, next) => {
  console.log(req.profile, "prof");
  console.log(req.auth, "auth");
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.staus(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    return res.status(403).json({
      error: "Admin Resource! Access Denied!",
    });
  }
  next();
};

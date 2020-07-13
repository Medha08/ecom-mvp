const express = require("express");
const router = express.Router();

// import controller

const { userById } = require("../controllers/user");
const { requireSignIn, isAdmin, isAuth } = require("../controllers/auth");

router.get("/secret/:userId", requireSignIn, isAuth, (req, res) => {
  res.json({ user: req.profile });
});

router.param("userId", userById);

module.exports = router;

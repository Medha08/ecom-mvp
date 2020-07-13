const express = require("express");
const router = express.Router();

// import controller

const {
  signup,
  signin,
  signout,
  requireSignIn,
} = require("../controllers/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;

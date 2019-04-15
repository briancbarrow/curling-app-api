const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRY } = require("../config");

const router = express.Router();

const localAuth = passport.authenticate("local", {
  session: false,
  failWithError: true
});

function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.email,
    expiresIn: JWT_EXPIRY
  });
}

router.post("/login", localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken, user: req.user });
});

const jwtAuth = passport.authenticate("jwt", {
  session: false,
  failWithError: true
});

router.post("/auth/refresh", jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;

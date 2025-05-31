const passport = require("../passport/passport").passport;
const GitHubStrategy = require("../passport/passport").GitHubStrategy;

require("dotenv").config();

const { Router } = require("express");
const router = new Router();

const { error } = require("../error");
const { signToken } = require("../db/jwt");

router.get(
  "/",
  passport.authenticate("github", {
    scope: ["user:email"],
    state: process.env.AUTH_STATE,
  })
);

router.get(
  "/callback",
  (req, res, next) => {
    passport.authenticate(
      "github",
      { failWithError: true },
      (err, user, info) => {
        console.dir("err: ", err, "user: ", user, "info: ", info);
        if (err) return next(err);
        if (!user) return next(new Error("No user found!"));

        // NEED TO CALL req.login()!!!
        req.login(user, next);
      }
    )(req, res, next);
  },
  signToken
);

router.use(error);

module.exports = { router };

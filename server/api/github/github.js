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
  })
);

router.get(
  "/callback",
  (req, res, next) => {
    passport.authenticate(
      "github",
      { failureRedirect: process.env.FRONTEND_URL + "/signin" },
      (err, user, info) => {
        if (err) return next(err);
        if (!user) return next(new Error("No user found!"));

        // // NEED TO CALL req.login()!!!
        // req.login(user, (err) => {
        //   if (err) return next(err);
        //   next(); // move to signToken
        // });
        console.log("User found. Setting req.user to user");
        req.user = user;
        next();
      }
    )(req, res, next);
  },
  signToken
);

router.use(error);

module.exports = { router };

const passport = require("../passport/passport").passport;
const JWTStrategy = require("../passport/passport").JWTStrategy;
const LocalStrategy = require("../passport/passport").LocalStrategy;
const GitHubStrategy = require("../passport/passport").GitHubStrategy;

const { Router } = require("express");
const router = new Router();

const { error } = require("../error");
const { signToken } = require("../db/jwt");

router.post("/", passport.authenticate("local", { session: false }), signToken);

router.use(error);

module.exports = { router };

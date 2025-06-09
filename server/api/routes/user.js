const { Router } = require("express");
const router = new Router();

const passport = require("../passport/passport").passport;

const { error } = require("../error");

// posts, in this context, are user posts
const postRouter = require("./post").router;
const profileRouter = require("./profile").router;
const requestRouter = require("./request").router;
const networkRouter = require("./network").router;
const reactionRouter = require("./reaction").router;

router.use(function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    // TODO: IMPLEMENT AN APPROPRIATE RESPONSE BECAUSE THE CURRENT ERROR IS 'BAD RESPONSE'
    // WHEN IT SHOULD BE RELATED TO UNAUTHORIZED
    if (!user) return next(new Error("User does not exist!"));

    req.user = user;
    next();
    // req.login(user, next); -> no need to call this as jwt is not session-based and needs a de/serializer from passport local
  })(req, res, next);
});

router.use("/profile", profileRouter);
router.use("/posts", postRouter);
router.use("/request", requestRouter);
router.use("/network", networkRouter);
router.use("/reaction", reactionRouter);
router.use(error);

module.exports = { router };

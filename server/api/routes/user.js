const { Router } = require("express");
const router = new Router();
const __isEmpty = require("lodash").isEmpty;
const passport = require("../passport/passport").passport;

const { error } = require("../error");

// posts, in this context, are user posts
const postRouter = require("./post").router;
const profileRouter = require("./profile").router;
const requestRouter = require("./request").router;
const networkRouter = require("./network").router;
const reactionRouter = require("./reaction").router;
const chatRouter = require("./chat").router;

let cookieOptions = {
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === "production", // true if using HTTPS
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

router.use(function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const cookies = !__isEmpty(req.cookies) && Object.keys(req.cookies);
      const signedCookies =
        !__isEmpty(req.signedCookies) && Object.keys(req.signedCookies);

      if (cookies) {
        console.log("Clearing unsigned cookies");
        for (let name of cookies) res.clearCookie(name, cookieOptions);
      }

      if (signedCookies) {
        console.log("Clearing signed cookies");
        for (let name of signedCookies) res.clearCookie(name, cookieOptions);
      }

      return res.status(401).json({
        message: !user ? "User does not exist" : "Unauthorized Access",
      });
    }

    req.user = user;
    next();
    // req.login(user, next); -> no need to call this as jwt is not session-based and needs a de/serializer from passport local
  })(req, res, next);
});

router.get("/auth/me", (req, res, next) =>
  res.json({ authenticated: !!req.user })
);

router.use("/profile", profileRouter);
router.use("/posts", postRouter);
router.use("/request", requestRouter);
router.use("/network", networkRouter);
router.use("/reaction", reactionRouter);
router.use("/chats", chatRouter);
router.use(error);

module.exports = { router };

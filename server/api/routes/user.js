const { Router } = require("express");
const router = new Router();

const passport = require("../passport/passport").passport;

const { error } = require("../error");
const {
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profileCtr");

//TODO: IMPLEMENT CRUD for profile, and post, then start designing client
router.use(
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    if (!req.user) return res.status(403).json({ data: "You shalt not pass" });
    next();
  }
);

router.get("/profile", getProfile);
router.post("/profile", createProfile);
router.put("/profile", updateProfile);
router.use(error);

module.exports = { router };

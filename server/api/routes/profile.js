const {
  fetchProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profileCtr");

const { Router } = require("express");
const router = new Router();

router.get("/", fetchProfile);
router.post("/", createProfile);
router.put("/", updateProfile);

module.exports = { router };
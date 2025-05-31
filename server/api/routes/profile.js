const {
  getProfile,
  createProfile,
  updateProfile,
} = require("../controllers/profileCtr");

const { Router } = require("express");
const router = new Router();

router.get("/", getProfile);
router.post("/", createProfile);
router.put("/", updateProfile);

module.exports = { router };

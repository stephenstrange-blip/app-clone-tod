const { Router } = require("express");
const router = new Router();

const {
  createNetwork,
  fetchNetwork,
  removeNetwork,
} = require("../controllers/networkCtr");

router.get("/", fetchNetwork);
router.post("/", createNetwork);
router.delete("/", removeNetwork);

module.exports = { router };

const { Router } = require("express");
const router = new Router();

const {
  createRequest,
  fetchRequest,
  removeRequest,
} = require("../controllers/requestCtr");

router.get("/", fetchRequest);
router.post("/", createRequest);
router.delete("/", removeRequest);

module.exports = { router };

const {
  createReaction,
  removeReaction,
} = require("../controllers/reactionCtr");

const { Router } = require("express");
const router = new Router();

router.post("/", createReaction);
router.delete("/", removeReaction);

module.exports = { router };

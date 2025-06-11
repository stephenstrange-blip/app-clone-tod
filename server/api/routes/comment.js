const { Router } = require("express");
const router = new Router();

const {
  createComment,
  createReply,
  fetchComment,
  removeComment,
} = require("../controllers/commentCtr");

router.get("/:postId/comments/:commentId", fetchComment);
router.post("/:postId", createComment);
router.post("/:postId/comments/:commentId", createReply);
router.delete("/:postId/comments/:commentId", removeComment);

module.exports = { router };

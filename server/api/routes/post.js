const { Router } = require("express");
const router = new Router();

const {
  createPost,
  removePost,
  updatePost,
  fetchPost,
} = require("../controllers/postCtr");

router.get("/:postId", fetchPost);
router.post("/", createPost);
router.put("/:postId", updatePost);
router.delete("/:postId", removePost);

module.exports = { router };

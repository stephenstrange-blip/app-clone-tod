const { Router } = require("express");
const router = new Router();

const {
  createPost,
  removePost,
  updatePost,
  fetchPost,
  fetchManyPost,
} = require("../controllers/postCtr");

router.get("/", fetchManyPost);
router.get("/:postId", fetchPost);
router.post("/", createPost);
router.put("/:postId", updatePost);
router.delete("/:postId", removePost);

module.exports = { router };

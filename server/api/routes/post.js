const { Router } = require("express");
const router = new Router();

const {
  createPost,
  removePost,
  updatePost,
  fetchPost,
} = require("../controllers/postCtr");

router.get("/", fetchPost);
router.post("/", createPost);
router.put("/", updatePost);
router.delete("/", removePost);

module.exports = { router };

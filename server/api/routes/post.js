const { Router } = require("express");
const router = new Router();

const commentRouter = require("./comment").router;

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

router.use("/", commentRouter);

module.exports = { router };

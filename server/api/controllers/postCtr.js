const { getPost, putPost, addPost, deletePost } = require("../db/database");

exports.fetchPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await getPost({ postId: Number(postId) });
    res.status(200).json({ data: { post } });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, message, categoryId } = req.body;
    let opts = { title, authorId: req.user.id, published: false };

    if (message) opts["message"] = message;
    if (categoryId) opts["categoryId"] = Number(categoryId);

    const post = await addPost(opts);
    res.status(200).json({ data: { post } });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { categoryId, title, message, published } = req.body;
    let opts = { postId: Number(req.params.postId) };

    if (categoryId) opts["categoryId"] = categoryId;
    if (title) opts["title"] = title;
    if (message) opts["message"] = message;
    if (published) opts["published"] = published === "true" ? true : false;

    const post = await putPost(opts);
  } catch (err) {
    next(err);
  }
};

exports.removePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    await deletePost({ postId: Number(postId) });
    res
      .status(200)
      .json({ data: { message: `Message ${postId} successfuly deleted` } });
  } catch (err) {
    next(err);
  }
};

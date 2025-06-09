const {
  getPost,
  putPost,
  addPost,
  deletePost,
  getManyPosts,
} = require("../db/database");
const _ = require("lodash");

exports.fetchPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await getPost({ postId: Number(postId) });
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.fetchManyPost = async (req, res, next) => {
  try {
    const { start, end, published, myPosts, categoryId } = req.query;
    let opts = {};

    if (start) opts.start = start;
    if (end) opts.end = end;
    if (published) opts.published = published;
    if (myPosts === "true") opts.authorId = req.user.id;
    if (categoryId) opts.categoryId = categoryId;

    const posts = await getManyPosts(opts, req.user.id);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json(posts);
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
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { title, categoryId, message, published } = req.body;
    let opts = {};

    if (categoryId) opts["categoryId"] = categoryId;
    if (title) opts["title"] = title;
    if (message) opts["message"] = message;
    if (published) opts["published"] = published === "true" ? true : false;

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

    if (_.isEmpty(opts))
      return res.status(200).json({ message: "Nothing to update" });

    opts = { ...opts, postId: Number(req.params.postId) };

    const post = await putPost(opts);
    res.status(200).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.removePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    await deletePost({ postId: Number(postId) });
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json({ message: `Message ${postId} successfuly deleted` });
  } catch (err) {
    next(err);
  }
};

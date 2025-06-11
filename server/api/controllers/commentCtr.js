const {
  addComment,
  addReply,
  deleteComment,
  getReply,
  getComment,
} = require("../db/database");

exports.createReply = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { commentId, postId } = req.params;

    if (message.replaceAll(/\s/g, "") === "")
      return next(new Error("Comment is empty or only contains whitespaces!"));

    const opts = {
      commentId: Number(commentId),
      postId: Number(postId),
      message,
      authorId: req.user.id,
    };
    await addReply(opts);

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json({ message: "Reply successfully created" });
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { postId } = req.params;

    if (message.replaceAll(/\s/g, "") === "")
      return next(new Error("Comment is empty or only contains whitespaces!"));

    const opts = { postId: Number(postId), message, authorId: req.user.id };
    await addComment(opts);

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json({ message: "Comment successfully created" });
  } catch (err) {
    next(err);
  }
};

exports.fetchComment = async (req, res, next) => {
  try {
    const { getReplies } = req.query;
    const { commentId } = req.params;
    let result;

    if (getReplies) {
      const _comment = getComment({ commentId: Number(commentId) });
      const _replies = getReply({ commentId: Number(commentId) });

      // Will fail if one of the promises reject;
      const [comment, replies] = await Promise.all([_comment, _replies]);
      result = { comment, replies };
    } else {
      result = await getComment({ commentId: Number(commentId) });
    }

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.removeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    await deleteComment({ id: Number(commentId), isDeleted: true });

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json({ message: "Comment successfully deleted" });
  } catch (err) {
    next(err);
  }
};

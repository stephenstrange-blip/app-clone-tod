const { deleteReaction, addReaction } = require("../db/database");
require("dotenv").config();

exports.createReaction = async (req, res, next) => {
  try {
    const { reactorId, postId, reactId } = req.body;

    const opts = {
      reactId: Number(reactId),
      postId: Number(postId),
      reactorId: reactorId ? Number(reactorId) : req.user.id,
    };

    if (Number(reactorId) === req.user.id)
      console.log(`ReactorId: ${reactorId} === currentUser: ${req.user.id}`);

    if (Number(reactorId) !== req.user.id)
      console.log(`ReactorId: ${reactorId} !== currentUser: ${req.user.id}`);

    await addReaction(opts);

    res.status(200).json({ message: "Successfully created" });
  } catch (err) {
    next(err);
  }
};

exports.removeReaction = async (req, res, next) => {
  try {
    const { id_react } = req.query;

    const opts = {
      id_react: Number(id_react),
    };
    console.log(opts);
    await deleteReaction(opts);

    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
};

const { getNetwork, addNetwork, deleteNetwork } = require("../db/database");
const _ = require("lodash");
require("dotenv").config();
const fields = {
  select: {
    firstName: true,
    lastName: true,
    userId: true,
  },
};

// 2 possible scenarios
// User fetches all that follows him/her
// User fetches all s/he follows
exports.fetchNetwork = async (req, res, next) => {
  try {
    let opts,
      selectFields,
      myFollowers = req.query.myFollowers,
      userId = req.user.id;

    if (myFollowers === "true") {
      opts = { followingId: userId };
      selectFields = { follower: fields };
    }

    if (myFollowers === "false") {
      opts = { followerId: userId };
      selectFields = { following: fields };
    }

    if (_.isEmpty(opts)) return next(new Error("Bad request body!"));

    const result = await getNetwork(opts, selectFields);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// 1 scenario:
// User B accepts a follow request from another user (i.e. User A)
exports.createNetwork = async (req, res, next) => {
  try {
    const { followerId } = req.body;
    if (!followerId) return next(new Error("Bad request body!"));

    const { assignedAt } = await addNetwork({
      followerId: Number(followerId),
      followingId: req.user.id,
    });

    res
      .status(200)
      .json({ message: "Successfuly added a network", assignedAt });
  } catch (err) {
    next(err);
  }
};

exports.removeNetwork = async (req, res, next) => {
  try {
    const { followerId, followingId } = req.query;

    if (!followerId || !followingId)
      return next(new Error("Bad request body!"));

    await deleteNetwork({
      followerId: Number(followerId),
      followingId: Number(followingId),
    });

    res.status(200).json({ message: "Successfuly removed a network" });
  } catch (err) {
    next(err);
  }
};

// TEST ALL REQUESTS AND NETWORK ROUTES

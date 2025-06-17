const { addRequest, deleteRequest, getRequest } = require("../db/database");
const _ = require("lodash");
require("dotenv").config();

const REQUESTS = {
  TO: {
    targetId: true, // currently logged in user's id
    requester: {
      select: {
        firstName: true,
        lastName: true,
        userId: true,
      },
    },
  },
  FROM: {
    requesterId: true, // currently logged in user's id
    target: {
      select: {
        firstName: true,
        lastName: true,
        userId: true,
      },
    },
  },
};

exports.createRequest = async (req, res, next) => {
  try {
    const { targetId } = req.body;
    if (!targetId) return next(new Error("Bad request body!"));

    await addRequest({ targetId: Number(targetId), requesterId: req.user.id });

    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.status(200).json({ message: "Request successfully created" });
  } catch (err) {
    next(err);
  }
};

// 3 possible scenarios:
// User A cancelling follow request to User B (remove request)
// User B rejecting follow request by User A (remove request)
// User B accepting follow request by User A (remove request, add to network)
exports.removeRequest = async (req, res, next) => {
  try {
    const { targetId, requesterId } = req.query;
    if (!targetId || !requesterId) return next(new Error("Bad request body!"));

    await deleteRequest({
      targetId: Number(targetId),
      requesterId: Number(requesterId),
    });

    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res
      .status(200)
      .json({ message: "Request successfully deleted", targetId, requesterId });
  } catch (err) {
    next(err);
  }
};

// 2 possible scenarios:
// User A fetches all requests s/he made ( UserA Id = requesterId = req.user.id)
// User A fetches all requests s/he has  ( UserA Id = targetId = req.user.id)
exports.fetchRequest = async (req, res, next) => {
  try {
    let opts,
      selectFields,
      fromRequests = req.query.fromRequests?.toLowerCase();

    if (fromRequests === "true") {
      opts = { requesterId: req.user.id };
      selectFields = REQUESTS.FROM;
    }

    if (fromRequests === "false") {
      opts = { targetId: req.user.id };
      selectFields = REQUESTS.TO;
    }

    if (_.isEmpty(opts)) return next(new Error("Bad request body!"));

    const followRequests = await getRequest(opts, selectFields);

    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.status(200).json(followRequests);
  } catch (err) {
    next(err);
  }
};

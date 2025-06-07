const { fetchProfile, addProfile, putProfile } = require("../db/database");
const _ = require("lodash");

exports.getProfile = async (req, res, next) => {
  console.log("fetching profile....", req.user);
  try {
    const { id } = req.user;

    const profile = await fetchProfile({ userId: id });
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
};

exports.createProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, title } = req.body;
    let opts = { firstName, lastName, userId: req.user.id };

    if (bio) opts = { ...opts, bio };
    if (title) opts = { ...opts, title };

    await addProfile(opts);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json({ message: "Profile Successfuly created!" });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, title } = req.body;
    let opts = {};

    if (firstName) opts["firstName"] = firstName;
    if (lastName) opts["lastName"] = lastName;
    if (bio) opts["bio"] = bio;
    if (title) opts["title"] = title;

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

    if (_.isEmpty(opts))
      return res.status(200).json({ message: "Nothing to update" });

    opts["userId"] = req.user.id;

    await putProfile(opts);
    res.status(200).json({ message: "Profile Successfuly updated!" });
  } catch (err) {
    next(err);
  }
};

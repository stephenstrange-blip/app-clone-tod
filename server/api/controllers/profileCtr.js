const { addProfile, putProfile, getProfile } = require("../db/database");
const _ = require("lodash");
require("dotenv").config();

exports.fetchProfile = async (req, res, next) => {
  console.log("fetching profile....", req.user);
  try {
    const { id } = req.user;

    const profile = await getProfile({ userId: id });

    const temp = profile._count.following;
    profile._count.following = profile._count.followers;
    profile._count.followers = temp;
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

    if (_.isEmpty(opts))
      return res.status(200).json({ message: "Nothing to update" });

    opts["userId"] = req.user.id;

    await putProfile(opts);
    res.status(200).json({ message: "Profile Successfuly updated!" });
  } catch (err) {
    next(err);
  }
};

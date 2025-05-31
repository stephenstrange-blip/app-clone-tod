const bcrypt = require("bcrypt");
const { addUser } = require("../db/database");

// ---------------------- Local (signup) STRATEGY ------------------------//
exports.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await addUser({ username, password: hashed });

    res
      .status(200)
      .json({ data: { id: result.id, username: result.username } });
  } catch (err) {
    next(err);
  }
};

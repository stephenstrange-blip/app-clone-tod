require("dotenv").config();
exports.logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Successful logout" });
    });
  } catch (err) {
    next(err, false);
  }
};

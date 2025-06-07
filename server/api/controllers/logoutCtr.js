exports.logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      res.json({ message: "Successful logout" });
    });
  } catch (err) {
    next(err, false);
  }
};

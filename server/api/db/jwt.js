require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.signToken = async (req, res, next) => {
  const { username, id, githubId } = req.user;
  let opts;

  if ((username && githubId) || (!username && !githubId))
    return next(
      new Error(
        "Either githubId or username should only be provided. Aborting token generation..."
      ),
      false
    );

  if (username) {
    opts = { id, username };
    console.log(`Logging in via local: Username: ${username}, id: ${id}`);
  }

  if (githubId) {
    opts = { id, githubId };
    console.log(`Logging in via github: githubId: ${githubId}, id: ${id}`);
  }

  jwt.sign(
    opts,
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "1d",
      audience: "http://localhost:8080",
      issuer: "http://localhost:8080",
    },
    (err, token) => {
      if (err) next(err, false);
      else {
        res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
        res.status(200).json({ token });
      }
    }
  );
};

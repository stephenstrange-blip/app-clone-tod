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
    console.log(`Logging in via local: Username: ${username},, id: ${id}`);
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
      audience: process.env.FRONTEND_URL,
      issuer: process.env.BASE_SERVER_URL,
    },
    (err, token) => {
      console.log("Token received");
      if (err) next(err, false);
      else {
        console.log("Setting a cookie from the token");
        res
          .status(201)
          .cookie("token", token, {
            httpOnly: true,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000, // ms,
            secure: process.env.NODE_ENV === "production", // true if using HTTPS
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            // domain: process.env.BASE_SERVER_URL, -> Domain name for the cookie. Defaults to the domain name of the app.
          })
          .redirect(process.env.FRONTEND_URL + "/home");
      }
    }
  );
};

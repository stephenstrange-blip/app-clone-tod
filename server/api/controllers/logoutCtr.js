const __isEmpty = require("lodash").isEmpty;

require("dotenv").config();

let cookieOptions = {
  httpOnly: true,
  signed: true,
  secure: process.env.NODE_ENV === "production", // true if using HTTPS
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

exports.logout = async (req, res, next) => {
  try {
    // For token-based logouts -
    // Current implementation - clear all cookies
    const cookies = !__isEmpty(req.cookies) && Object.keys(req.cookies);
    const signedCookies =
      !__isEmpty(req.signedCookies) && Object.keys(req.signedCookies);

    if (cookies) {
      console.log("Clearing unsigned cookies");
      for (let name of cookies) res.clearCookie(name, cookieOptions);
    }

    if (signedCookies) {
      console.log("Clearing signed cookies");
      for (let name of signedCookies) res.clearCookie(name, cookieOptions);
    }

    return res.status(205).end();

    /**
     * For session-based logouts
     * req.logout((err) => {
     *  if (err) return next(err)
     *  res.json({message: "Successful logout"})
     * })
     */
  } catch (err) {
    next(err);
  }
};

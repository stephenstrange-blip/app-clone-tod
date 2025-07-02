const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const _ = require("lodash");
const bcrypt = require("bcrypt");
const prisma = require("../db/prisma").prisma;

const {
  fetchCredentials,
  fetchUser,
  addUser,
  addProfile,
} = require("../db/database");

require("dotenv").config();

const ERROR = {
  MISSING: "Missing Input",
  INVALID_INPUT: "Incorrect username or password",
  INVALID_TOKEN: "Invalid token",
};

const GITHUB = {
  CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};

// ---------------------- JWT STRATEGY ------------------------//

const opts = {
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  jwtFromRequest: function (req) {
    if (req && req.signedCookies) {
      console.log(req.signedCookies?.token ? "Token found" : "No token found");
      return req.signedCookies?.token;
    }
    console.log("No signed cookies found. Returning null");
    return null;
  },
  secretOrKey: process.env.JWT_SECRET,
  audience: process.env.FRONTENT_URL,
  issuer: process.env.BASE_SERVER_URL,
  algorithms: ["HS256"],
  ignoreExpiration: true,
};

passport.use(
  new JWTStrategy(opts, async (payload, done) => {
    let user;
    try {
      if (payload.githubId) {
        console.log("verifying github signup");
        user = await fetchUser({ id: payload.id, githubId: payload.githubId });
      } else {
        console.log("verifying local signup ");
        user = await fetchUser({ id: payload.id });
      }

      if (!user) done(ERROR.INVALID_TOKEN, false);

      done(null, user);
    } catch (err) {
      prisma.$disconnect().catch((error) => console.error(error));
      done(err, false);
    }
  })
);

// ---------------------- Local (Sign-in) STRATEGY ------------------------//

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (!username || !password) done(ERROR.MISSING, false);

      const user = await fetchCredentials({ username });
      if (!user) return done(new Error(ERROR.INVALID_INPUT), false);

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(new Error(ERROR.INVALID_INPUT), false);

      // pass username and id for jwt signing
      done(null, { username, id: user.id });
    } catch (err) {
      prisma.$disconnect().catch((error) => console.error(error));
      done(err, false);
    }
  })
);

// ---------------------- Github2 STRATEGY ------------------------//

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB.CLIENT_ID,
      clientSecret: GITHUB.CLIENT_SECRET,
      callbackURL: `${process.env.BASE_SERVER_URL}/auth/github/callback`,
      state: false,
      passReqToCallback: true,
      // allRawEmails: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      (async () => {
        try {
          if (process.env.NODE_ENV === "development") {
            console.log(
              `Access token: ${accessToken}, Refresh token: ${refreshToken}`
            );
          }

          if (!profile?.id)
            return done(new Error("github ID is missing!"), false);

          let user = await fetchUser({ githubId: Number(profile.id) });

          // add to database for first time logins using github account
          let seedProfile;
          if (!user || _.isEmpty(user)) {
            console.log("Adding new github user to database...");
            user = await addUser({ githubId: Number(profile.id) });

            seedProfile = {
              userId: Number(user.id),
              firstName: profile.username || "user",
              lastName: profile.displayName || "user",
              bio: profile.bio || "bio",
            };

            await addProfile(seedProfile);
          }

          // user => { githubId: Int, id: Int}
          done(null, user);
        } catch (err) {
          console.error(err);
          prisma.$disconnect().catch((error) => console.error(error));
          done(err, false);
        }
      })();
    }
  )
);

module.exports = {
  JWTStrategy,
  LocalStrategy,
  GitHubStrategy,
  passport,
};

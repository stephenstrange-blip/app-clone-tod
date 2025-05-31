const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const _ = require("lodash");
const bcrypt = require("bcrypt");
const prisma = require("../db/prisma").prisma;

const { fetchCredentials, fetchUser, createUser } = require("../db/database");

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
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  audience: "http://localhost:8080",
  issuer: "http://localhost:8080",
  algorithms: ["HS256"],
  ignoreExpiration: true,
};

passport.use(
  new JWTStrategy(opts, async (payload, done) => {
    try {
      const user = await fetchUser({ id: payload.id });
      if (!user) done(null, false, ERROR.INVALID_TOKEN);

      done(null, user);
    } catch (err) {
      await prisma.$disconnect();
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

      await prisma.$disconnect();
      // pass username and id for jwt signing
      done(null, { username, id: user.id });
    } catch (err) {
      await prisma.$disconnect();
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
      callbackURL: "http://127.0.0.1:8080/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.dir("Github profile:", profile);
        console.log("AccessToken: ", accessToken);
        console.log("RefreshToken: ", refreshToken);

        if (!profile.id) return done(new Error("github ID is missing!"), false);

        let user = await fetchUser({ githubId: profile.id });

        // add to database for first time logins using github account
        if (_.isEmpty(user)) user = await createUser({ githubId: profile.id });

        // user = { githubId: Int, id: Int}
        done(null, user);
      } catch (err) {
        await prisma.$disconnect();
        done(err, false);
      }
    }
  )
);

module.exports = {
  JWTStrategy,
  LocalStrategy,
  GitHubStrategy,
  passport,
};

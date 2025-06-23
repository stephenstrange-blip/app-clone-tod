const express = require("express");
const routes = require("./api/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { fa } = require("@faker-js/faker");
const prisma = require("./api/db/prisma").prisma;
const passport = require("./api/passport/passport").passport;

require("dotenv").config();

const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // ms,
      secure: process.env.NODE_ENV === "production", // true if using HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      signed: true,
    },
    proxy: true, // allow CORS
    secret: process.env.COOKIE_SECRET, // should be equal to the cookie secret supplied to cookieParser
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
      dispose: async (key, value) => {
        if (!key || !value) console.log("Sessions dropped. No key or value");
        console.log("Sessions dropped", key, value);
      },
    }),
  })
);

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1); // Allow CORS for production

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.session());

// app.use(cors({ origin: /app-clone-tod\.netlify\.app$/ }));
app.use(cors({ origin: true, credentials: true }));

app.use("/signup", routes.signup);
app.use("/auth/local", routes.login);
app.use("/auth/github", routes.github);
app.use("/users", routes.user);
app.use("/logout", routes.logout);

app.use("{*any}", (req, res) => {
  res.status(403).json({ message: "Page not found" });
});

app.listen(8080);

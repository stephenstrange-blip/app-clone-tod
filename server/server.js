const express = require("express");
const routes = require("./api/index");
const cors = require("cors");

const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./api/db/prisma").prisma;
const passport = require("./api/passport/passport").passport;

require("dotenv").config();

const app = express();

app.use(
  expressSession({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.PRISMA_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.session());

app.use(
  cors({ origin: [process.env.FRONTEND_URL, /app-clone-tod\.netlify\.app$/] })
);

app.use("/signup", routes.signup);
app.use("/auth/local", routes.login);
app.use("/auth/github", routes.github);
app.use("/users", routes.user);
app.use("/logout", routes.logout);

app.use("{*any}", (req, res) => {
  res.status(403).json({ message: "Page not found" });
});

app.listen(8080);

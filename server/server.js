const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const __isEmpty = require("lodash").isEmpty;

const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./api/db/prisma").prisma;
const passport = require("./api/passport/passport").passport;

const { createServer } = require("node:http");
const { Server } = require("socket.io");

const routes = require("./api/index");
const handlers = require("./api/socket/index");

require("dotenv").config();

async function main() {
  const app = express();
  const server = createServer(app);

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

  const io = new Server(server, {
    connectionStateRecovery: {},
    path: "/chatroom/",
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.engine.use(cookieParser(process.env.COOKIE_SECRET));

  io.engine.use((req, res, next) => {
    const isHandShake = req._query.sid === undefined;
    if (isHandShake) {
      console.log("Authenticating socket handshake http request");
      passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
          const cookies = !__isEmpty(req.cookies) && Object.keys(req.cookies);
          const signedCookies =
            !__isEmpty(req.signedCookies) && Object.keys(req.signedCookies);

          if (cookies) {
            console.log("Clearing unsigned cookies");
            for (let name of cookies) res.clearCookie(name, cookieOptions);
          }

          if (signedCookies) {
            console.log("Clearing signed cookies");
            for (let name of signedCookies)
              res.clearCookie(name, cookieOptions);
          }

          const err = new Error("Something went wrong");
          err.data = {
            message: !user ? "User does not exist" : "Unauthorized Access",
          };
          return next(err);
        }

        req.user = user;
        next();
        // req.login(user, next); -> no need to call this as jwt is not session-based and needs a de/serializer from passport local
      })(req, res, next);
    } else {
      next();
    }
  });

  io.of("/").on("connection", async (socket) => {
    console.log(
      "A user connected to main namespace",
      `${io.engine.clientsCount} user has connected in total`
    );
  });

  io.of("/chats").on("connection", async (socket) => {
    console.log("A user has connected to chats namespace");
    socket.emit("fireEvent", "A user connected to chats namespace");

    handlers.room(io, socket);
    handlers.disconnect(io, socket);
    handlers.recordMessage(io, socket);

    if (!socket.recovered) await handlers.recover(io, socket);
  });

  server.listen(8080);
}

main();

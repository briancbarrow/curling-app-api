// import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

const localStrategy = require('./passport/localStrategy');
const jwtStrategy = require('./passport/jwt');

import * as db from "./queries";
import { PORT, CLIENT_ORIGIN } from "./config";

const authRouter = require('./routes/authRoute');
const usersCreateRouter = require('./routes/userCreateRoute');
// const usersUpdateRouter = require('./routes/userUpdateRoute');

// var serviceAccount = require("./curling-authentication-firebase-adminsdk-xjskw-bba563e1ff.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://curling-authentication.firebaseio.com"
// });

passport.use(localStrategy);
passport.use(jwtStrategy);

const app = express();

// Log all requests
app.use(morgan("dev"));

// Enable CORS support
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  }),
);

// Parse request body
app.use(express.json());

// Protect endpoints using JWT Strategy
const jwtAuth = passport.authenticate("jwt", {
  session: false,
  failWithError: true
});

app.get("/", (request, response) => {
  response.json({ info: " Curling Node.js, Express, and Postgress API" });
});
app.use("/api", authRouter);
app.use("/api/users/create", usersCreateRouter);
// app.use("/api/users/update", jwtAuth, usersUpdateRouter);

app.get("/users", db.getUsers);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Listen for incoming connections
app
  .listen(PORT, () => {
    console.info(`App running on port ${PORT}.`);
  })
  .on("error", err => {
    console.error(err);
  });

// import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";



import * as db from "./queries";
import { PORT, CLIENT_ORIGIN } from "./config";

// var serviceAccount = require("./curling-authentication-firebase-adminsdk-xjskw-bba563e1ff.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://curling-authentication.firebaseio.com"
// });

const app = express();

// Log all requests
app.use(morgan('dev'));

// Enable CORS support
app.use(cors());

// Parse request body
app.use(express.json());

app.get("/", (request, response) => {
  response.json({ info: " Curling Node.js, Express, and Postgress API" });
});

app.get("/users", db.getUsers);

// Custom 404 Not Found route handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
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
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Listen for incoming connections
app.listen(PORT, () => {
  console.info(`App running on port ${PORT}.`);
}).on('error', err => {
  console.error(err);
});

import express from "express";
// import bodyParser from "body-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import * as db from "./queries";

dotenv.config();
// var serviceAccount = require("./curling-authentication-firebase-adminsdk-xjskw-bba563e1ff.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://curling-authentication.firebaseio.com"
// });

const app = express();
const port = process.env.PORT || 3000;

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

// Custom Error Handler
app.use((err, req, res) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
    if (err.name !== 'FakeError') console.log(err);
  }
});

// Listen for incoming connections
app.listen(port, () => {
  console.info(`App running on port ${port}.`);
}).on('error', err => {
  console.error(err);
});

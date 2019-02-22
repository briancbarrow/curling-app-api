import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import * as admin from "firebase-admin";

import * as db from "./queries";

dotenv.config();
var serviceAccount = require("./curling-authentication-firebase-adminsdk-xjskw-bba563e1ff.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://curling-authentication.firebaseio.com"
});

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (request, response) => {
  response.json({ info: " Curling Node.js, Express, and Postgress API" });
});

app.get("/users", db.getUsers);

app.post("/newGame", db.newGame);
app.post("/updateGame", db.updateGame);
app.post("/submitGame", db.submitGame);
// app.post("/submitPlayerStats", db.submitPlayerStats);

app.post("/newUser", db.newUser);
app.post("/newGroup", db.newGroup);

app.listen(port || 3000, () => {
  console.log(`App running on port ${port}.`);
});

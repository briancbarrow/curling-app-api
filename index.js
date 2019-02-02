import express from "express";
import bodyParser from "body-parser";
import * as db from "./queries";

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

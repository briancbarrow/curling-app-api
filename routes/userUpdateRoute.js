const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("../queriesConfig");
const router = express.Router();

router.put("/", (req, res, next) => {
  const userId = req.user.id;
  const toUpdate = {};
  const updateableFields = [
    "groups",
    "high_score",
    "highest_end_score",
    "low_score",
    "lowest_end_score",
    "games_won",
    "games_lost",
  ];

  // if field is not an updateablefield throw error!
  const requestBodyKeys = Object.keys(req.body);
  requestBodyKeys.forEach((key) => {
    if (!updateableFields.includes(key)) {
      const err = new Error(`${key} is not a valid field`);
      err.status = 400;
      return next(err);
    }
  });

  updateableFields.forEach((field) => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  knex("users")
    .returning([
      "name",
      "email",
      "groups",
      "high_score",
      "highest_end_score",
      "low_score",
      "lowest_end_score",
      "games_won",
      "games_lost",
    ])
    .where({ id: userId })
    .update(toUpdate)
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

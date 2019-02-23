const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("../queriesConfig");
const router = express.Router();

/* ========== POST/CREATE A GAME ========== */
router.post("/", (req, res, next) => {
  console.log("HELLO");
  const requiredFields = ["player1Id", "player2Id"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const intFields = ["player1Id", "player2Id"];
  const nonIntField = intFields.find(
    field => field in req.body && typeof req.body[field] !== "number"
  );

  if (nonIntField) {
    const err = new Error(`Field: '${nonIntField}' must be type Number`);
    err.status = 422;
    return next(err);
  }

  const { player1Id, player2Id } = req.body;
  let usersExist = false;

  let player1Exists = knex("users")
    .where({ id: req.query.player1Id })
    .then(rows => {
      if (rows[0]) {
        usersExist = true;
      } else {
        usersExist = false;
      }
    })
    .catch(error => {
      throw error;
    });

  let player2Exists = knex("users")
    .where({ id: req.query.player2Id })
    .then(rows => {
      if (rows[0]) {
        usersExist = true;
      } else {
        usersExist = false;
      }
    })
    .catch(error => {
      throw error;
    });

  usersExist = player1Exists && player2Exists;

  if (usersExist) {
    console.log("DO I EVEN GET HERE");
    knex("gameData")
      .returning("id")
      .insert({
        player1_id: req.query.player1Id,
        player2_id: req.query.player2Id,
        groupId: req.query.groupId || null,
        player1Score: 0,
        player2Score: 0,
        winner_Id: null,
        inProgress: true,
        gameTypeIsNormal: req.query.gameTypeIsNormal || true
      })
      .asCallback((error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results);
      });
  } else {
    console.log("Before reject");
    reject(new Error("User does not exist"));
  }
});
module.exports = router;

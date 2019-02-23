const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("../queriesConfig");
const router = express.Router();

import { submitPlayerStats } from "./routeHelpers";

/* ========== POST/CREATE A GAME ========== */
router.put("/", (req, res, next) => {
  console.log("here");
  const requiredFields = [
    "player1Id",
    "player2Id",
    "gameId",
    "inProgress",
    "player1Score",
    "player2Score"
  ];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const intFields = [
    "player1Id",
    "player2Id",
    "gameId",
    "player1Score",
    "player2Score"
  ];
  const nonIntField = intFields.find(
    field => field in req.body && typeof req.body[field] !== "number"
  );

  if (nonIntField) {
    const err = new Error(`Field: '${nonIntField}' must be type Number`);
    err.status = 422;
    return next(err);
  }

  const boolFields = ["inProgress"];
  const nonBoolField = boolFields.find(
    field => field in req.body && typeof req.body[field] !== "boolean"
  );

  if (nonBoolField) {
    const err = new Error(`Field: '${nonBoolField}' must be type Boolean`);
    err.status = 422;
    return next(err);
  }

  const {
    gameId,
    player1Id,
    player2Id,
    player1Score,
    player2Score,
    inProgress
  } = req.body;
  const winningScore = Math.max(player1Score, player2Score);
  let winner_Id, loser_Id, loserScore;
  if (winningScore == player1Score) {
    winner_Id = player1Id;
    loser_Id = player2Id;
    loserScore = player2Score;
  } else {
    winner_Id = player2Id;
    loser_Id = player1Id;
    loserScore = player1Score;
  }

  knex("gameData")
    .returning(["winner_Id"])
    .where({ id: gameId })
    .update({
      player1Score,
      player2Score,
      inProgress,
      winner_Id,
      datePlayed: new Date()
    })
    .then(rows => {
      // new Promise(function(resolve, reject) {
      //   resolve(submitPlayerStats(winner_Id, winningScore, true));
      //   reject("Error updating winning score");
      // })
      //   .then(winnerScoreResult => {
      //     console.log(`winningScore (${winner_Id}) from ${gameId} updated`);
      //     new Promise((resolve, reject) => {
      //       resolve(submitPlayerStats(loser_Id, loserScore, false));
      //       reject("Error updating losing score");
      //     })
      //       .then(loserScoreResult => {
      //         console.log(`losingScore (${loser_Id}) from ${gameId} updated`);
      //       })
      //       .catch(err => {
      //         res.status(401).json(err);
      //       });
      //   })
      //   .catch(err => {
      //     res.status(401).json(err);
      //   });
      submitPlayerStats(winner_Id, winningScore, true);
      submitPlayerStats(loser_Id, loserScore, false);
      res.status(200).json(rows[0]);
    })
    .catch(error => {
      if (error) {
        throw error;
      }
    });

  // if (usersExist) {
  //   console.log("DO I EVEN GET HERE");
  //   knex("gameData")
  //     .returning("id")
  //     .insert({
  //       player1_id: req.query.player1Id,
  //       player2_id: req.query.player2Id,
  //       groupId: req.query.groupId || null,
  //       player1Score: 0,
  //       player2Score: 0,
  //       winner_Id: null,
  //       inProgress: true,
  //       gameTypeIsNormal: req.query.gameTypeIsNormal || true
  //     })
  //     .asCallback((error, results) => {
  //       if (error) {
  //         throw error;
  //       }
  //       res.status(200).json(results);
  //     });
  // } else {
  //   console.log("Before reject");
  //   reject(new Error("User does not exist"));
  // }
});
module.exports = router;

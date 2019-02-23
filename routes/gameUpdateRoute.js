const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("../queriesConfig");
const router = express.Router();

/* ========== PUT/UPDATE A GAME ========== */
router.put("/", (req, res, next) => {
  const requiredFields = ["gameId", "player1Score", "player2Score"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const intFields = ["gameId", "player1Score", "player2Score"];
  const nonIntField = intFields.find(
    field => field in req.body && typeof req.body[field] !== "number"
  );

  if (nonIntField) {
    const err = new Error(`Field: '${nonIntField}' must be type Number`);
    err.status = 422;
    return next(err);
  }

  const { gameId, player1Score, player2Score } = req.body;

  console.log("DO I EVEN GET HERE game update");
  knex("gameData")
    .returning(["player1Score", "player2Score"])
    .where({ id: gameId })
    .update({
      player1Score,
      player2Score
    })
    .then(results => {
      res.status(200).json(results);
    })
    .catch(error => {
      next(error);
    });
});
module.exports = router;

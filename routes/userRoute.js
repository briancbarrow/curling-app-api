const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("../queriesConfig");
const router = express.Router();

import { getUserInfo } from "./routeHelpers";

/* ========== GET USER INFO ========== */
router.get("/:id", (req, res, next) => {
  let id = parseInt(req.params.id);
  knex
    .select()
    .from("users")
    .where({ id: id })
    .then(results => {
      const {
        groups,
        high_score,
        highest_end_score,
        lowest_end_score,
        low_score,
        games_won,
        games_lost
      } = results[0];
      res.status(200).json({
        groups,
        high_score,
        highest_end_score,
        lowest_end_score,
        low_score,
        games_won,
        games_lost
      });
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;

const knex = require("../queriesConfig");

// Get Users
const getUsers = (req, res) => {
  knex
    .select()
    .from("users")
    .orderBy("id")
    .asCallback((error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results);
    });
};

//submit new stats for each user and update if new records made
const submitPlayerStats = (id, score, wasWinner) => {
  const statTableName = wasWinner ? "games_won" : "games_lost";
  knex("users")
    .returning(["id", "name", "high_score", "low_score"])
    .where({ id: id })
    .increment({
      [statTableName]: 1
    })
    .then(rows => {
      ///update if new records were made for each player
      if (score < rows[0].low_score || rows[0].low_score === null) {
        knex("users")
          .where({ id: id })
          .update({ low_score: score })
          .then(result => {
            return true;
          })
          .catch(error => {
            console.log(error);
          });
      }
      if (score > rows[0].high_score || rows[0].high_score === null) {
        knex("users")
          .where({ id: id })
          .update({ high_score: score })
          .then(result => {
            return true;
          })
          .catch(error => {
            console.log(error);
          });
      }
    })
    .catch(error => {
      if (error) {
        throw error;
      }
    });
};

////update if new records were made for group
const submitGroupStats = (id, score, wasWinner) => {
  const statTableName = wasWinner ? "games_won" : "games_lost";
  knex("users")
    .returning(["id", "name", "high_score", "low_score"])
    .where({ id: id })
    .increment({
      [statTableName]: 1
    })
    .then(rows => {
      ///update if new records were made for each player
      if (score < rows[0].low_score || rows[0].low_score === null) {
        knex("users")
          .where({ id: id })
          .update({ low_score: score })
          .catch(error => {
            console.log(error);
          });
      }
      if (score > rows[0].high_score || rows[0].high_score === null) {
        knex("users")
          .where({ id: id })
          .update({ high_score: score })
          .catch(error => {
            console.log(error);
          });
      }
      return true;
    })
    .catch(error => {
      if (error) {
        throw error;
      }
    });
};

////update reigning group champion if needed

module.exports = {
  getUsers,
  // newGame,
  // newUser,
  // updateGame,
  submitPlayerStats
};

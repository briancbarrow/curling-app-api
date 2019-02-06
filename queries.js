const knex = require("./queriesConfig");

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

//TODO:
//create new game
const newGame = (req, res) => {
  const player1Id = req.data;
  knex("gameData")
    .returning("id")
    .insert({
      player1_id: req.query.player1Id,
      player2_id: req.query.player2Id,
      groupId: req.query.groupId || null,
      player1_score: 0,
      player2_score: 0,
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
  //console.log(req.query);
  //res.status(200).json;
};
//create user
//submit new stats for each user and update if new records made
//submit game score and stats
////update if new records were made for each player
////update if new records were made for group
////update reigning group champion if needed

module.exports = {
  getUsers,
  newGame
};

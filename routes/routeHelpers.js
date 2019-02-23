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

// const doesUserExist = userId => {
//   knex("users")
//     .returning("id")
//     .where({ id: userId })
//     .then(rows => {
//       if (rows[0]) {
//         return true;
//       } else {
//         return false;
//       }
//     });
// };

//create new game
// const newGame = (req, res) => {
//   ///////NEED to check if players exist first
//   let usersExist = false;
//   let userPromise = new Promise((resolve, reject) => {
//     knex("users")
//       .where({ id: req.query.player1Id })
//       .then(rows => {
//         if (rows[0]) {
//           usersExist = true;
//         } else {
//           usersExist = false;
//         }
//         knex("users")
//           .where({ id: req.query.player2Id })
//           .then(rows => {
//             if (rows[0]) {
//               usersExist = true;
//             } else {
//               usersExist = false;
//             }

//             if (usersExist) {
//               resolve(usersExist);
//             } else {
//               console.log("Before reject");
//               reject(new Error("User does not exist"));
//             }
//           })
//           .catch(error => {
//             throw error;
//           });
//       })
//       .catch(error => {
//         throw error;
//       });
//   })
//     .then(doUsersExist => {
//       console.log("DO I EVEN GET HERE");
//       knex("gameData")
//         .returning("id")
//         .insert({
//           player1_id: req.query.player1Id,
//           player2_id: req.query.player2Id,
//           groupId: req.query.groupId || null,
//           player1Score: 0,
//           player2Score: 0,
//           winner_Id: null,
//           inProgress: true,
//           gameTypeIsNormal: req.query.gameTypeIsNormal || true
//         })
//         .asCallback((error, results) => {
//           if (error) {
//             throw error;
//           }
//           res.status(200).json(results);
//         });
//     })
//     .catch(error => {
//       res.status(500).json({ error: "User Does Not Exist" });
//     });
// };
// //create user
// const newUser = (req, res) => {
//   const { name, email } = req.query;
//   knex("users")
//     .returning("id")
//     .insert({
//       name,
//       email,
//       password
//     })
//     .asCallback((error, results) => {
//       if (error) {
//         throw error;
//       }
//       res.status(200).json(results);
//     });
// };

//update game score
// const updateGame = (req, res) => {
//   const { gameId, player1Score, player2Score } = req.query;
//   knex("gameData")
//     .returning(["player1Score", "player2Score"])
//     .where({ id: gameId })
//     .update({
//       player1Score,
//       player2Score
//     })
//     .asCallback((error, results) => {
//       if (error) {
//         throw error;
//       }
//       res.status(200).json(results);
//     });
// };

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

//submit game score and stats
const submitGame = (req, res) => {
  console.log("or here");
  const {
    gameId,
    player1_id,
    player2_id,
    player1Score,
    player2Score,
    inProgress
  } = req.query;
  const winningScore = Math.max(player1Score, player2Score);
  let winner_Id, loser_Id, loserScore;
  if (winningScore == player1Score) {
    winner_Id = player1_id;
    loser_Id = player2_id;
    loserScore = player2Score;
  } else {
    winner_Id = player2_id;
    loser_Id = player1_id;
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
      new Promise(function(resolve, reject) {
        submitPlayerStats(winner_Id, winningScore, true);
      }).then(
        new Promise((resolve, reject) => {
          submitPlayerStats(loser_Id, loserScore, false);
        })
      );

      // new Promise
      res.status(200).json(rows);
    })
    .catch(error => {
      if (error) {
        throw error;
      }
    });
};

// Create New Group
const newGroup = (req, res) => {
  const { name, creatorId } = req.query;
  knex("groups")
    .returning("id")
    .insert({
      name,
      members: [creatorId],
      adminMembers: [creatorId]
    })
    .asCallback((error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results);
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
  submitPlayerStats,
  newGroup
};

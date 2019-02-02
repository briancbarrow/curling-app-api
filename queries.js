const pool = require("./queriesConfig");

const getUsers = (req, res) => {
  pool.query(`SELECT * FROM "users" ORDER BY id ASC`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

//TODO:
//create new game
//create user
//submit new stats for each user and update if new records made
//submit game score and stats
////update if new records were made for each player
////update if new records were made for group
////update reigning group champion if needed

module.exports = {
  getUsers
};

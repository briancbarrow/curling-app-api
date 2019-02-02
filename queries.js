const pool = require("./queriesConfig");

const getUsers = (req, res) => {
  console.log(pool);
  pool.query(`SELECT * FROM "testUsers" ORDER BY id ASC`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

module.exports = {
  getUsers
};

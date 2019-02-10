const knex = require("../queriesConfig");
const queryMethods = require("../queries");
const newUserMethod = queryMethods.newUser;

const newUser = {
  'alex',
  'alex@test.com',
  password: hashedPW
};

newUserMethod()

// knex
// .select("name")
// .from("users")
// .orderBy("id")
// .asCallback((error, results) => {
//   if (error) {
//     throw error;
//   }
//   console.log(results);
// });



knex("users")
  .where({ name: "Jerry" })
  .first()
  .then(results => {
    user = results;
    console.log(user);
    if (!user) {
      console.log("NO USER!");
      return Promise.reject({
        reason: "LoginError",
        message: "Incorrect username",
        location: "username"
      });
    }
  });

// //create user
// const newUser = (req, res) => {
//     const { name, email } = req.query;
//     knex("users")
//       .returning("id")
//       .insert({
//         name,
//         email
//       })
//       .asCallback((error, results) => {
//         if (error) {
//           throw error;
//         }
//         res.status(200).json(results);
//       });
//   };

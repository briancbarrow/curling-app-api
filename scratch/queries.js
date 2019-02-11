const knex = require("../queriesConfig");
const queryMethods = require("../queries");
const newUserMethod = queryMethods.newUser;

const newUser = {
  name: 'alex',
  email: 'alex@test.com',
  password: '$2a$10$zXchivLdvLDS.GkTQxRQ9.tW0lUo/CPU0VyUMdePB6vgE3rq5WZ6a'
};

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


knex("users")
.returning("id")
.insert(newUser)
.asCallback((error, results) => {
  if (error) {
    throw error;
  }
  console.log(results);
  // res.status(200).json(results);
});

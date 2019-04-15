// import { strategy as LocalStrategy } from "passport-local";
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcryptjs");
import knex from "../queriesConfig";

// Note: Use `function` (not an `arrow function`) to allow setting `this`
// validatePassword = function validateThatPassword(pwd) {
//   const currentUser = this;
//   return bcrypt.compare(pwd, currentUser.password);
// };

// ===== Define and create basicStrategy =====
const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  // Basic Login
  knex("users")
    .where({ name: username })
    .first()
    .then(results => {
      user = results;
      if (!user) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect username",
          location: "username"
        });
      }
      return bcrypt.compare(password, user.password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect password",
          location: "password"
        });
      }
      let tempUser = {
        name: user.name,
        email: user.email,
        userId: user.id
      };
      return done(null, tempUser);
    })
    .catch(err => {
      // console.log('Line 32: LocalStrategy');
      // console.log(err);
      if (err.reason === "LoginError") {
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;

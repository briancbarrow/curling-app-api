const { Strategy: LocalStrategy } = require('passport-local');

// ===== Define and create basicStrategy =====
const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User.findOne({ username })
    .then((results) => {
      user = results;
      if (!user) {
        // console.log('line 11: localStrategy');
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username',
        });
      }
      return user.validatePassword(password);
    })
    .then((isValid) => {
      if (!isValid) {
        // console.log('Line 22: localStrategy');
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password',
          location: 'password',
        });
      }
      return done(null, user.toObject());
    })
    .catch((err) => {
      // console.log('Line 32: LocalStrategy');
      // console.log(err);
      if (err.reason === 'LoginError') {
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;

const express = require("express");
const bcrypt = require("bcryptjs");
const queryMethods = require("../queries");
const router = express.Router();
const newUserMethod = queryMethods.newUser;
/* ========== POST/CREATE A USER ========== */
router.post("/", (req, res, next) => {
  const requiredFields = ["name", "email", "password"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ["name", "email", "password"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be type String`);
    err.status = 422;
    return next(err);
  }

  const explicityTrimmedFields = ["name", "email", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error(
      `Field: '${nonTrimmedField}' cannot start or end with whitespace`
    );
    err.status = 422;
    return next(err);
  }

  const sizedFields = {
    name: { min: 1 },
    password: { min: 10, max: 72 }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  if (tooSmallField) {
    const { min } = sizedFields[tooSmallField];
    const err = new Error(
      `Field: '${tooSmallField}' must be at least ${min} characters long`
    );
    err.status = 422;
    return next(err);
  }

  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooLargeField) {
    const { max } = sizedFields[tooLargeField];
    const err = new Error(
      `Field: '${tooLargeField}' must be at most ${max} characters long`
    );
    err.status = 422;
    return next(err);
  }

  const { name, email, password } = req.body;

  const hashedPassword = new Promise((resolve, reject) => {
    resolve(bcrypt.hash(password, 10));
  });

  return hashedPassword
    .then(hashedPW => {
      console.log(hashedPW);
      const newUser = {
        name,
        email,
        password: hashedPW
      };
      console.log(newUser);
      const newlyCreatedUser = new Promise((resolve, reject) => {
        resolve(newUserMethod(newUser));
      });
      newlyCreatedUser.then(result => {
        console.log(result);
        res
          .status(201)
          .location(`/api/users/${result.id}`)
          .json(result);
      });
    })

    .catch(err => {
      if (err.code === 11000) {
        err = new Error("The username or email already exists");
        err.status = 400;
        err.reason = "ValidationError";
      }
      next(err);
    });

  // return User.hashPassword(password)
  //   .then((digest) => {
  //     const newUser = {
  //       name,
  //       email,
  //       username,
  //       password: digest,
  //     };
  //     return User.create(newUser);
  //   })
  //   .then((result) => res
  //     .status(201)
  //     .location(`/api/users/${result.id}`)
  //     .json(result))
  //   .catch((err) => {
  //     if (err.code === 11000) {
  //       err = new Error('The username or email already exists');
  //       err.status = 400;
  //       err.reason = 'ValidationError';
  //     }
  //     next(err);
  //   });
});

module.exports = router;

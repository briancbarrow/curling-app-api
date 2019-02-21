const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('../queriesConfig');
const router = express.Router();

/* ========== POST/CREATE A USER ========== */
router.post('/', (req, res, next) => {
  const requiredFields = ['name', 'email', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ['name', 'email', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be type String`);
    err.status = 422;
    return next(err);
  }

  const explicityTrimmedFields = ['name', 'email', 'password'];
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
      'min' in sizedFields[field] &&
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
      'max' in sizedFields[field] &&
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

  knex
    .select('email')
    .from('users')
    .where('email', email)
    .then(rows => {
      if (rows.length === 0) {
        const hashedPassword = new Promise((resolve, reject) => {
          resolve(bcrypt.hash(password, 10));
        });

        hashedPassword.then(hashedPW => {
          console.log('hashedPW?', hashedPW);
          console.log('hashedPW.length', hashedPW.length);
          const newItem = { name, email, password: hashedPW };

          knex
            .insert(newItem)
            .into('users')
            .returning('id')
            .then(results => {
              const result = results[0];
              res
                .status(201)
                .location(`${req.originalUrl}/${result.id}`)
                .json(result);
            })
            .catch(err => {
              next(err);
            });
        });
      } else {
        const newlyCreatedError = new Error('user already exists!');
        res
          .status(401)
          .location(`${req.originalUrl}`)
          .json(newlyCreatedError.message);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

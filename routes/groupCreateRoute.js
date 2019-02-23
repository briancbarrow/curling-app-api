const express = require("express");
const bcrypt = require("bcryptjs");
const knex = require("../queriesConfig");
const router = express.Router();

/* ========== POST/CREATE A GROUP ========== */
router.post("/", (req, res, next) => {
  const requiredFields = ["name", "creatorId"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }

  const stringFields = ["name"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be type String`);
    err.status = 422;
    return next(err);
  }

  const intFields = ["creatorId"];
  const nonIntField = intFields.find(
    field => field in req.body && typeof req.body[field] !== "number"
  );

  if (nonIntField) {
    const err = new Error(`Field: '${nonIntField}' must be type Number`);
    err.status = 422;
    return next(err);
  }

  const explicityTrimmedFields = ["name"];
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
    name: { min: 1, max: 45 }
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

  const { name, creatorId } = req.body;
  knex("groups")
    .returning("id")
    .insert({
      name,
      members: [creatorId],
      adminMembers: [creatorId]
    })
    .then(results => {
      res.status(200).json(results);
    })
    .catch(error => {
      if (error) {
        throw error;
      }
    });
});

module.exports = router;

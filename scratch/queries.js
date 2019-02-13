const knex = require('../queriesConfig');
const queryMethods = require('../queries');
const newUserMethod = queryMethods.newUser;

const newUser = {
  name: 'alex',
  email: 'alex@test.com',
  password: '$2a$10$zXchivLdvLDS.GkTQxRQ9.tW0lUo/CPU0VyUMdePB6vgE3rq5WZ6a'
};

let email = 'alex@test.com';





// knex
//   .select('email')
//   .from('users')
//   .where('email', email)
//   .then(rows => {
//     console.log(rows);
//     console.log(`rows.length: ${rows.length}`);
//     if (rows.length === 0) {
//       console.log(true);
//       return knex('users')
//       .returning('id')
//       .insert(newUser)
//       .then(results => {
//         const result = results[0];
//         res
//           .status(201)
//           .location(`${req.originalUrl}/${result.id}`)
//           .json(result);
//       })
//       .catch(err => {
//         next(err);
//       });
//     } else {
//       console.log('inside the else');
//       const newlyCreatedError = new Error('user already exists!');
//       console.log(newlyCreatedError);
//     }
//   })
//   .catch(error => {
//     console.log(error);
//   })





// knex('users')
//   .where({ name: 'Jerry' })
//   .first()
//   .then(results => {
//     user = results;
//     console.log(user);
//     if (!user) {
//       console.log('NO USER!');
//       return Promise.reject({
//         reason: 'LoginError',
//         message: 'Incorrect username',
//         location: 'username'
//       });
//     }
//   });





// knex('users')
//   .returning('id')
//   .insert(newUser)
//   .asCallback((error, results) => {
//     if (error) {
//       throw error;
//     }
//     console.log(results);
//     // res.status(200).json(results);
//   });




// DELETE A USER
knex('users')
  .where('id', '18')
  .del()
  .then(() => {
    knex
      .select()
      .from('users')
      .orderBy('id')
      .asCallback((error, results) => {
        if (error) {
          throw error;
        }
        console.log(results);
      });
  });

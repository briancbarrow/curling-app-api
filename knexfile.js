'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'elmer.db.elephantsql.com',
      user: 'wdxllrrx',
      password: 'DUyFn2iv3i4YkThPzYUqdio3m0ytlpcI',
      database: 'wdxllrrx'
    },
    // debug: true, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  production: {
    client: 'pg',
    connection: {
      host: 'elmer.db.elephantsql.com',
      user: 'wdxllrrx',
      password: 'DUyFn2iv3i4YkThPzYUqdio3m0ytlpcI',
      database: 'wdxllrrx'
    }
  }
};

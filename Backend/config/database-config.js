const pg = require("pg");

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

// const pool = new Pool({
//     user: 'REPLACE_WITH_YOUR_USERNAME',
//     host: 'REPLACE_WITH_YOUR_HOST',
//     database: 'REPLACE_WITH_YOUR_DATABASE',
//     password: 'REPLACE_WITH_YOUR_PASSWORD',
//     dialect: 'REPLACE_WITH_YOUR_DIALECT',
//     port: 'REPLACE_WITH_YOUR_PORT'
// });

module.exports = pool
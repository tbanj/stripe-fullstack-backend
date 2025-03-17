const { neon } = require("@neondatabase/serverless");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

const sql = neon(databaseUrl);

module.exports = sql;

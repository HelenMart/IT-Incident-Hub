
const { Pool } = require("pg");
require("dotenv").config();

const db = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5434),
  user: process.env.DB_USER || "helen",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "incident_hub"
});

module.exports = db;

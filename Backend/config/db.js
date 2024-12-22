const { Sequelize } = require('sequelize');
require('dotenv').config(); // Lataa .env-tiedoston muuttujat

// Set up the MariaDB connection using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

module.exports = sequelize;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import Sequelize instance

const Purchase = sequelize.define('Purchase', {
  cardName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardExpiration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cart: {
    type: DataTypes.JSON, // Store the cart as JSON
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Purchase;

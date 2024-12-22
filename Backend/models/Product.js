const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING }, // A comma-separated string of image names or URLs
  // Tässä tallennetaan pilkulla eroteltu lista kuvan URL:ista
  category: { type: DataTypes.STRING }, // Kategoriasarake
  discountedPrice: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.discount > 0 ? this.price - (this.price * (this.discount / 100)) : this.price;
    },
  },
}, {
  timestamps: true,
});

module.exports = Product;

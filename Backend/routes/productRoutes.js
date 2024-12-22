const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/Product');

// Määritetään multer kuvatiedostojen tallennusta varten
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Tallennuskansio
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Uniikki tiedostonimi
  },
});

const upload = multer({ storage });


/**
 * @api {post} /products Add a Product
 * @apiName AddProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Add a new product to the catalog.
 *
 * @apiBody {String} name Name of the product.
 * @apiBody {Number} price Price of the product.
 * @apiBody {String} [description] Product description.
 * @apiBody {String} category Product category.
 * @apiBody {File[]} images Array of images for the product.
 *
 * @apiSuccess {Object} product Created product details.
 * @apiSuccess {Number} product.id ID of the created product.
 * @apiSuccess {String} product.name Name of the product.
 * @apiSuccess {Number} product.price Price of the product.
 * @apiSuccess {String} product.category Category of the product.
 * @apiSuccess {String} [product.description] Description of the product.
 * @apiSuccess {String} [product.image] Comma-separated list of image filenames.
 *
 * @apiError {String} message Error message.
 */

// Reitti tuotteen lisäämiseen
router.post('/products', upload.array('images', 10), async (req, res) => {
  try {
    const { name, price, discount, description, category } = req.body;

    // Tallennetaan kuvien tiedostonimet pilkulla erotettuna
    const images = req.files ? req.files.map(file => file.filename).join(',') : '';

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const newProduct = await Product.create({
      name,
      price,
      discount: discount || 0,
      description,
      image: images,
      category,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @api {get} /products Get All Products
 * @apiName GetAllProducts
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Retrieve all products in the catalog.
 *
 * @apiSuccess {Object[]} products List of products.
 * @apiSuccess {Number} products.id ID of the product.
 * @apiSuccess {String} products.name Name of the product.
 * @apiSuccess {Number} products.price Price of the product.
 * @apiSuccess {String} products.category Category of the product.
 * @apiSuccess {String} [products.description] Description of the product.
 * @apiSuccess {String} [products.image] Comma-separated list of image filenames.
 *
 * @apiError {String} message Error message.
 */

// Reitti kaikkien tuotteiden hakemiseen
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @api {get} /products/category/:category Get Products by Category
 * @apiName GetProductsByCategory
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Retrieve all products for a specific category.
 *
 * @apiParam {String} category The category to filter products by.
 *
 * @apiSuccess {Object[]} products List of products in the category.
 * @apiSuccess {Number} products.id ID of the product.
 * @apiSuccess {String} products.name Name of the product.
 * @apiSuccess {Number} products.price Price of the product.
 * @apiSuccess {String} products.category Category of the product.
 * @apiSuccess {String} [products.description] Description of the product.
 * @apiSuccess {String} [products.image] Comma-separated list of image filenames.
 *
 * @apiError {String} message Error message.
 */

// Reitti tuotteiden hakemiseen kategorian mukaan
router.get('/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.findAll({ where: { category } });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @api {get} /products/:id Get Product by ID
 * @apiName GetProductById
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Retrieve details of a specific product by its ID.
 *
 * @apiParam {Number} id The unique ID of the product.
 *
 * @apiSuccess {Object} product Product details.
 * @apiSuccess {Number} product.id ID of the product.
 * @apiSuccess {String} product.name Name of the product.
 * @apiSuccess {Number} product.price Price of the product.
 * @apiSuccess {String} product.category Category of the product.
 * @apiSuccess {String} [product.description] Description of the product.
 * @apiSuccess {String} [product.image] Comma-separated list of image filenames.
 *
 * @apiError {String} message Error message.
 */

// Reitti yksittäisen tuotteen hakemiseen ID:n perusteella
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @api {delete} /products/:id Delete Product by ID
 * @apiName DeleteProductById
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Delete a specific product by its ID.
 *
 * @apiParam {Number} id The unique ID of the product to delete.
 *
 * @apiSuccess {String} message Success message confirming deletion.
 *
 * @apiError {String} message Error message if the product is not found or cannot be deleted.
 */

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

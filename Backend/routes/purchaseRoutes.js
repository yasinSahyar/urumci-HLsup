const express = require('express');
const Purchase = require('../models/Purchase');
const router = express.Router();


/**
 * @api {post} /api/purchase Add Purchase
 * @apiName AddPurchase
 * @apiGroup Purchases
 * @apiVersion 1.0.0
 * @apiDescription Save purchase details to the database.
 *
 * @apiBody {Object} customerDetails Customer information (name, address, etc.).
 * @apiBody {Object} paymentDetails Payment information (card number, expiry date, etc.).
 * @apiBody {Array} cart List of purchased items.
 * @apiBody {Number} total Total cost of the purchase.
 *
 * @apiSuccess {String} message Success message confirming the purchase was saved.
 * @apiSuccess {Object} data The saved purchase details.
 *
 * @apiError {String} error Error message if the purchase could not be saved.
 */

// POST route to save purchase details
router.post('/api/purchase', async (req, res) => {
  try {
    const { customerDetails, paymentDetails, cart, total } = req.body;

    // Save the purchase to the database
    const newPurchase = await Purchase.create({
      ...customerDetails,
      ...paymentDetails,
      cart,
      total,
    });

    res.status(201).json({ message: 'Purchase saved successfully!', data: newPurchase });
  } catch (error) {
    console.error('Error saving purchase:', error);
    res.status(500).json({ error: 'Failed to save purchase.' });
  }
});


/**
 * @api {get} /api/purchase Get All Purchases
 * @apiName GetAllPurchases
 * @apiGroup Purchases
 * @apiVersion 1.0.0
 * @apiDescription Retrieve all purchase records from the database.
 *
 * @apiSuccess {Object[]} purchases List of all purchase records.
 * @apiSuccess {Number} purchases.id Purchase ID.
 * @apiSuccess {Object} purchases.customerDetails Customer information.
 * @apiSuccess {Object} purchases.paymentDetails Payment details.
 * @apiSuccess {Array} purchases.cart List of items in the purchase.
 * @apiSuccess {Number} purchases.total Total cost of the purchase.
 *
 * @apiError {String} error Error message if purchases could not be retrieved.
 */

// GET route to fetch all purchases
router.get('/api/purchase', async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases.' });
  }
});

/**
 * @api {delete} /api/purchase/:id Delete Purchase
 * @apiName DeletePurchase
 * @apiGroup Purchases
 * @apiVersion 1.0.0
 * @apiDescription Delete a specific purchase record by its ID.
 *
 * @apiParam {Number} id Unique ID of the purchase to be deleted.
 *
 * @apiSuccess {String} message Success message confirming the purchase was deleted.
 *
 * @apiError {String} message Error message if the purchase is not found or could not be deleted.
 */

router.delete('/api/purchase/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    await purchase.destroy();
    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ message: 'Failed to delete purchase.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * @api {post} /signup User Signup
 * @apiName Signup
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiDescription Create a new user account.
 *
 * @apiBody {String} username Username for the user.
 * @apiBody {String} email Email of the user.
 * @apiBody {String} phone Phone number of the user.
 * @apiBody {String} password Password for the user.
 *
 * @apiSuccess {String} message Signup success message.
 * @apiSuccess {Object} user Created user details.
 */


// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Check if email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ username, email, phone, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username } });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @api {post} /signin User Signin
 * @apiName Signin
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiDescription Authenticate a user.
 *
 * @apiBody {String} email Email of the user.
 * @apiBody {String} password Password of the user.
 *
 * @apiSuccess {String} message Signin success message.
 * @apiSuccess {Object} user Authenticated user details.
 */
// Signin Route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Signin successful', user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

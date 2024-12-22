const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

/**
 * @api {post} /feedback Add Feedback
 * @apiName SubmitFeedback
 * @apiGroup Feedback
 * @apiVersion 1.0.0
 * @apiDescription Submit feedback from a user.
 *
 * @apiBody {String} name Name of the user.
 * @apiBody {String} email Email of the user.
 * @apiBody {String} message Feedback message.
 *
 * @apiSuccess {String} message Success message.
 */
router.post('/', async (req, res) => {
  console.log('Received feedback:', req.body);
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const feedback = await Feedback.create({ name, email, message });
    res.status(201).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Error sending feedback' });
  }
});

/**
 * @api {get} /feedback Get All Feedback
 * @apiName GetFeedback
 * @apiGroup Feedback
 * @apiVersion 1.0.0
 * @apiDescription Retrieve all feedback submissions.
 *
 * @apiSuccess {Array} feedback List of feedback submissions.
 */
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.findAll();
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @api {delete} /feedback/:id Delete Feedback
 * @apiName DeleteFeedback
 * @apiGroup Feedback
 * @apiVersion 1.0.0
 * @apiDescription Poista palaute ID:n perusteella.
 *
 * @apiParam {Number} id Palautteen yksilöllinen ID.
 *
 * @apiSuccess {String} message Poiston onnistumisviesti.
 *
 * @apiError FeedbackNotFound Jos palautetta ei löydy.
 * @apiErrorExample {json} Virhe-vastaus:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "message": "Feedback not found"
 *    }
 */
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    await feedback.destroy();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

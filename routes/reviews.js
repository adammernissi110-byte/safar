const express = require('express');
const router = express.Router();
const {
  createReview,
  getTripReviews,
  getHotelReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, createReview);

router.get('/trip/:tripId', getTripReviews);
router.get('/hotel/:hotelId', getHotelReviews);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteReview);

module.exports = router;

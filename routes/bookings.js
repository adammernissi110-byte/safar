const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  createStripeCheckout,
  verifyStripePayment
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getUserBookings)
  .post(createBooking);

router.post('/stripe/create-checkout', createStripeCheckout);
router.post('/stripe/verify', verifyStripePayment);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .patch(cancelBooking);

module.exports = router;

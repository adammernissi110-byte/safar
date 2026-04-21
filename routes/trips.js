const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripsByLocation
} = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getTrips)
  .post(protect, authorize('admin'), createTrip);

router.route('/location').get(getTripsByLocation);

router.route('/:id')
  .get(getTrip)
  .put(protect, authorize('admin'), updateTrip)
  .delete(protect, authorize('admin'), deleteTrip);

module.exports = router;

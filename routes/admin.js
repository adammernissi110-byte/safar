const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getRevenueReport,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueReport);

router.route('/bookings')
  .get(getAllBookings);

router.route('/bookings/:id/status')
  .put(updateBookingStatus);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id/role')
  .put(updateUserRole);

module.exports = router;

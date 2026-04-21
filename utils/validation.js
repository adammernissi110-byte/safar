const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

exports.authValidation = [
  require('express-validator').body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  require('express-validator').body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.registerValidation = [
  require('express-validator').body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  require('express-validator').body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  require('express-validator').body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
  require('express-validator').body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-()]+$/).withMessage('Please provide a valid phone number')
];

exports.tripValidation = [
  require('express-validator').body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  require('express-validator').body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  require('express-validator').body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  require('express-validator').body('duration')
    .trim()
    .notEmpty().withMessage('Duration is required'),
  require('express-validator').body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  require('express-validator').body('location.lat')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  require('express-validator').body('location.lng')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

exports.hotelValidation = [
  require('express-validator').body('name')
    .trim()
    .notEmpty().withMessage('Hotel name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  require('express-validator').body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  require('express-validator').body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  require('express-validator').body('address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  require('express-validator').body('location.lat')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  require('express-validator').body('location.lng')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

exports.bookingValidation = [
  require('express-validator').body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format'),
  require('express-validator').body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['stripe', 'cod']).withMessage('Payment method must be stripe or cod'),
  require('express-validator').body('guests')
    .optional()
    .isInt({ min: 1 }).withMessage('Guests must be at least 1'),
  require('express-validator').body('tripId')
    .optional()
    .isMongoId().withMessage('Invalid trip ID'),
  require('express-validator').body('hotelId')
    .optional()
    .isMongoId().withMessage('Invalid hotel ID')
];

exports.reviewValidation = [
  require('express-validator').body('bookingId')
    .notEmpty().withMessage('Booking ID is required')
    .isMongoId().withMessage('Invalid booking ID'),
  require('express-validator').body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  require('express-validator').body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
];

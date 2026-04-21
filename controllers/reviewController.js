const Review = require('../models/Review');
const Trip = require('../models/Trip');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

exports.createReview = async (req, res) => {
  try {
    const { bookingId, tripId, hotelId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    const review = await Review.create({
      booking: bookingId,
      user: req.user.id,
      trip: tripId,
      hotel: hotelId,
      rating,
      comment
    });

    if (tripId) {
      const stats = await Review.calculateAverageRating(tripId, 'trip');
      await Trip.findByIdAndUpdate(tripId, {
        rating: stats.averageRating,
        numReviews: stats.numReviews
      });
    }

    if (hotelId) {
      const stats = await Review.calculateAverageRating(hotelId, 'hotel');
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: stats.averageRating,
        numReviews: stats.numReviews
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating review'
    });
  }
};

exports.getTripReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ trip: req.params.tripId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get trip reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
};

exports.getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get hotel reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    if (review.trip) {
      const stats = await Review.calculateAverageRating(review.trip, 'trip');
      await Trip.findByIdAndUpdate(review.trip, {
        rating: stats.averageRating,
        numReviews: stats.numReviews
      });
    }

    if (review.hotel) {
      const stats = await Review.calculateAverageRating(review.hotel, 'hotel');
      await Hotel.findByIdAndUpdate(review.hotel, {
        rating: stats.averageRating,
        numReviews: stats.numReviews
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting review'
    });
  }
};

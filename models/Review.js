const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    trim: true,
    minlength: 10,
    maxlength: 500
  }
}, {
  timestamps: true
});

reviewSchema.index({ user: 1 });
reviewSchema.index({ trip: 1 });
reviewSchema.index({ hotel: 1 });

reviewSchema.statics.calculateAverageRating = async function(modelId, type) {
  const stats = await this.aggregate([
    {
      $match: { [type]: modelId }
    },
    {
      $group: {
        _id: `$${type}`,
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      numReviews: stats[0].numReviews
    };
  }
  return { averageRating: 0, numReviews: 0 };
};

module.exports = mongoose.model('Review', reviewSchema);

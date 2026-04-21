const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a trip title'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide a city'],
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  duration: {
    type: String,
    required: [true, 'Please provide trip duration'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  images: [{
    type: String
  }],
  location: {
    lat: {
      type: Number,
      required: [true, 'Please provide latitude']
    },
    lng: {
      type: Number,
      required: [true, 'Please provide longitude']
    }
  },
  category: {
    type: String,
    enum: ['adventure', 'cultural', 'desert', 'coastal', 'mountain', 'city-tour'],
    default: 'city-tour'
  },
  maxGuests: {
    type: Number,
    default: 10,
    min: 1
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

tripSchema.index({ location: '2dsphere' });
tripSchema.index({ city: 1, price: 1 });

module.exports = mongoose.model('Trip', tripSchema);

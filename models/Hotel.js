const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a hotel name'],
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
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
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
  address: {
    type: String,
    required: [true, 'Please provide an address']
  },
  amenities: [{
    type: String
  }],
  rooms: {
    type: Number,
    default: 10,
    min: 1
  },
  available: {
    type: Boolean,
    default: true
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

hotelSchema.index({ location: '2dsphere' });
hotelSchema.index({ city: 1, price: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);

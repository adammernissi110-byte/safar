const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const Hotel = require('../models/Hotel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createBooking = async (req, res) => {
  try {
    const { tripId, hotelId, date, endDate, paymentMethod, guests, notes } = req.body;

    if (!tripId && !hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either tripId or hotelId'
      });
    }

    let item;
    let itemType;
    let basePrice;

    if (tripId) {
      item = await Trip.findById(tripId);
      itemType = 'trip';
      basePrice = item.price;
    } else if (hotelId) {
      item = await Hotel.findById(hotelId);
      itemType = 'hotel';
      basePrice = item.price;
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const numNights = endDate ? Math.ceil((new Date(endDate) - new Date(date)) / (1000 * 60 * 60 * 24)) : 1;
    const totalPrice = basePrice * (guests || 1) * numNights;

    const booking = await Booking.create({
      user: req.user.id,
      trip: tripId,
      hotel: hotelId,
      date,
      endDate,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'pending',
      guests: guests || 1,
      totalPrice,
      notes,
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('trip', 'title city')
      .populate('hotel', 'name city');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking'
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { status } = req.query;
    let query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('trip', 'title city images')
      .populate('hotel', 'name city images')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('trip', 'title city description images')
      .populate('hotel', 'name city address images');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking'
    });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    const allowedFields = ['status', 'notes', 'cancellationReason'];
    const updateData = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('trip', 'title city').populate('hotel', 'name city');

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking'
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'User cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking'
    });
  }
};

exports.createStripeCheckout = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('trip')
      .populate('hotel');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    const item = booking.trip || booking.hotel;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title || item.name,
              description: item.description || `${item.city} accommodation`
            },
            unit_amount: Math.round(booking.totalPrice * 100)
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id
      }
    });

    res.status(200).json({
      success: true,
      data: { sessionId: session.id, url: session.url }
    });
  } catch (error) {
    console.error('Create Stripe checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating checkout session'
    });
  }
};

exports.verifyStripePayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const booking = await Booking.findById(session.metadata.bookingId);

      if (booking) {
        booking.paymentStatus = 'paid';
        booking.stripePaymentId = session.id;
        booking.status = 'confirmed';
        await booking.save();

        res.status(200).json({
          success: true,
          message: 'Payment verified successfully',
          data: booking
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Verify Stripe payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying payment'
    });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const booking = await Booking.findById(session.metadata.bookingId);
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.stripePaymentId = session.id;
        booking.status = 'confirmed';
        await booking.save();
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  res.json({ received: true });
};

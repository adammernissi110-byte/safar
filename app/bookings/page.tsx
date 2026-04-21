'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { loadStripe } from '@stripe/stripe-js';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function BookingsPage() {
  const { user, token } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/bookings/stripe/create-checkout`,
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.data.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unpaid':
        return <CreditCard className="w-5 h-5 text-yellow-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-gray-600 mb-4">Please login to view your bookings</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-primary text-white py-12 md:py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">My Bookings</h1>
          <p className="text-lg md:text-xl text-white/90">
            Manage your trips and hotel reservations
          </p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No bookings yet</p>
            <a
              href="/trips"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition-colors touch-feedback"
            >
              Explore Trips
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 touch-feedback"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {booking.trip?.title || booking.hotel?.name}
                    </h3>
                    <p className="text-gray-600">
                      {booking.trip?.city || booking.hotel?.city}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    {getStatusIcon(booking.status)}
                    <span className="font-medium capitalize">{booking.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <div>
                      <p className="text-xs">Date</p>
                      <p className="font-medium">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <div>
                      <p className="text-xs">Total</p>
                      <p className="font-medium">${booking.totalPrice}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <div>
                      <p className="text-xs">Payment</p>
                      <p className="font-medium uppercase">{booking.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getPaymentStatusIcon(booking.paymentStatus)}
                    <div className="ml-2">
                      <p className="text-xs text-gray-600">Status</p>
                      <p className="font-medium capitalize">{booking.paymentStatus}</p>
                    </div>
                  </div>
                </div>

                {booking.paymentStatus === 'unpaid' && booking.paymentMethod === 'stripe' && (
                  <button
                    onClick={() => handlePayment(booking._id)}
                    className="w-full md:w-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light transition-colors touch-feedback"
                  >
                    Pay Now
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

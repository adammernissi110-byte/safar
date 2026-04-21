'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Trip {
  _id: string;
  title: string;
  city: string;
  price: number;
  duration: string;
  description: string;
  images: string[];
  location: { lat: number; lng: number };
  rating: number;
  numReviews: number;
  maxGuests: number;
}

interface TripCardProps {
  trip: Trip;
  index?: number;
}

export default function TripCard({ trip, index = 0 }: TripCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden touch-feedback md:touch-none"
    >
      <Link href={`/trips/${trip._id}`}>
        <div className="relative h-48 md:h-56 overflow-hidden">
          <Image
            src={trip.images[0] || '/placeholder-trip.jpg'}
            alt={trip.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">{trip.rating || 'New'}</span>
          </div>
        </div>

        <div className="p-4 md:p-5">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {trip.title}
          </h3>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{trip.city}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{trip.duration}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">{trip.maxGuests} guests</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{trip.price}</span>
              <span className="text-gray-500 text-sm ml-1">/ person</span>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors text-sm font-medium touch-feedback">
              Book Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { MapPin, Star, DollarSign, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Hotel {
  _id: string;
  name: string;
  city: string;
  price: number;
  rating: number;
  images: string[];
  location: { lat: number; lng: number };
  address: string;
  amenities: string[];
  starRating: number;
}

interface HotelCardProps {
  hotel: Hotel;
  index?: number;
}

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    parking: Car,
    breakfast: Coffee,
    gym: Dumbbell,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden touch-feedback md:touch-none"
    >
      <Link href={`/hotels/${hotel._id}`}>
        <div className="relative h-48 md:h-56 overflow-hidden">
          <Image
            src={hotel.images[0] || '/placeholder-hotel.jpg'}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {hotel.starRating && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="flex">
                {[...Array(hotel.starRating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:p-5">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {hotel.name}
          </h3>

          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{hotel.city}</span>
          </div>

          {hotel.rating > 0 && (
            <div className="flex items-center mb-3">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm font-medium">{hotel.rating}</span>
              <span className="text-gray-400 text-sm ml-1">/ 5</span>
            </div>
          )}

          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.slice(0, 3).map((amenity, i) => {
                const Icon = amenityIcons[amenity.toLowerCase()] || Star;
                return (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{hotel.price}</span>
              <span className="text-gray-500 text-sm ml-1">/ night</span>
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

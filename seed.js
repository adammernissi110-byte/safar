const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trip = require('./models/Trip');
const Hotel = require('./models/Hotel');
const User = require('./models/User');

dotenv.config();

const trips = [
  {
    title: 'Sahara Desert Adventure',
    city: 'Merzouga',
    price: 299,
    duration: '3 days / 2 nights',
    description: 'Experience the magic of the Sahara Desert with camel trekking, overnight in luxury camps, and witness breathtaking sunrises over the dunes.',
    images: ['https://images.unsplash.com/photo-1539020140153-e479b6c60021?w=800'],
    location: { lat: 31.0802, lng: -4.0134 },
    category: 'desert',
    maxGuests: 8,
    rating: 4.9,
    numReviews: 127
  },
  {
    title: 'Marrakech City Tour',
    city: 'Marrakech',
    price: 149,
    duration: '1 day',
    description: 'Explore the vibrant souks, historic palaces, and beautiful gardens of the Red City. Visit Jardin Majorelle, Bahia Palace, and Jemaa el-Fnaa square.',
    images: ['https://images.unsplash.com/photo-1597211833969-759a2c7d9e23?w=800'],
    location: { lat: 31.6295, lng: -7.9811 },
    category: 'city-tour',
    maxGuests: 12,
    rating: 4.7,
    numReviews: 89
  },
  {
    title: 'Chefchaouen Blue Pearl',
    city: 'Chefchaouen',
    price: 199,
    duration: '2 days / 1 night',
    description: 'Discover the enchanting blue-washed streets of Chefchaouen, nestled in the Rif Mountains. Perfect for photography and relaxation.',
    images: ['https://images.unsplash.com/photo-1560965386-1f5f9228c8a3?w=800'],
    location: { lat: 35.1716, lng: -5.2697 },
    category: 'cultural',
    maxGuests: 10,
    rating: 4.8,
    numReviews: 64
  },
  {
    title: 'Atlas Mountains Trek',
    city: 'Imlil',
    price: 249,
    duration: '2 days / 1 night',
    description: 'Trek through the stunning High Atlas Mountains, visit traditional Berber villages, and enjoy panoramic views of Mount Toubkal.',
    images: ['https://images.unsplash.com/photo-1570554520976-8f5c0e2f4c8a?w=800'],
    location: { lat: 31.1333, lng: -7.9167 },
    category: 'mountain',
    maxGuests: 8,
    rating: 4.9,
    numReviews: 52
  },
  {
    title: 'Essaouira Coastal Escape',
    city: 'Essaouira',
    price: 179,
    duration: '2 days / 1 night',
    description: 'Relax on the beautiful beaches of Essaouira, explore the historic medina, and enjoy fresh seafood by the Atlantic coast.',
    images: ['https://images.unsplash.com/photo-15491410-9398d6a97c5e?w=800'],
    location: { lat: 31.5085, lng: -9.7595 },
    category: 'coastal',
    maxGuests: 10,
    rating: 4.6,
    numReviews: 43
  },
  {
    title: 'Fes Historical Tour',
    city: 'Fes',
    price: 169,
    duration: '1 day',
    description: 'Step back in time in the ancient medina of Fes, visit the famous tanneries, Al Quaraouiyine University, and beautiful madrasas.',
    images: ['https://images.unsplash.com/photo-1577147443647-81856d5159d5?w=800'],
    location: { lat: 34.0331, lng: -5.0003 },
    category: 'cultural',
    maxGuests: 12,
    rating: 4.7,
    numReviews: 71
  }
];

const hotels = [
  {
    name: 'Sahara Luxury Camp',
    city: 'Merzouga',
    price: 250,
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800'],
    location: { lat: 31.0850, lng: -4.0100 },
    address: 'Erg Chebbi Dunes, Merzouga',
    amenities: ['wifi', 'breakfast', 'parking'],
    starRating: 5,
    numReviews: 98
  },
  {
    name: 'Riad Marrakech Palace',
    city: 'Marrakech',
    price: 180,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
    location: { lat: 31.6340, lng: -7.9890 },
    address: 'Medina, Marrakech',
    amenities: ['wifi', 'breakfast', 'gym'],
    starRating: 4,
    numReviews: 156
  },
  {
    name: 'Blue Mountain Hotel',
    city: 'Chefchaouen',
    price: 120,
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    location: { lat: 35.1680, lng: -5.2720 },
    address: 'Avenue Hassan II, Chefchaouen',
    amenities: ['wifi', 'breakfast'],
    starRating: 3,
    numReviews: 72
  },
  {
    name: 'Atlas Kasbah',
    city: 'Imlil',
    price: 150,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    location: { lat: 31.1350, lng: -7.9200 },
    address: 'Imlil Valley, High Atlas',
    amenities: ['wifi', 'breakfast', 'parking'],
    starRating: 4,
    numReviews: 45
  },
  {
    name: 'Ocean View Resort',
    city: 'Essaouira',
    price: 200,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    location: { lat: 31.5120, lng: -9.7650 },
    address: 'Boulevard de la Resistance, Essaouira',
    amenities: ['wifi', 'breakfast', 'gym', 'parking'],
    starRating: 5,
    numReviews: 89
  },
  {
    name: 'Fes Heritage Hotel',
    city: 'Fes',
    price: 140,
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    location: { lat: 34.0350, lng: -4.9980 },
    address: 'Fes el-Bali, Fes',
    amenities: ['wifi', 'breakfast'],
    starRating: 4,
    numReviews: 63
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('DB Connection Error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Trip.deleteMany({});
    await Hotel.deleteMany({});
    console.log('Cleared existing data');

    // Insert trips
    const insertedTrips = await Trip.insertMany(trips);
    console.log(`Inserted ${insertedTrips.length} trips`);

    // Insert hotels
    const insertedHotels = await Hotel.insertMany(hotels);
    console.log(`Inserted ${insertedHotels.length} hotels`);

    // Create admin user
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@moroccotravel.com' },
      {
        name: 'Admin User',
        email: 'admin@moroccotravel.com',
        password: 'admin123',
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    console.log('Admin user created/updated');

    // Create test user
    const testUser = await User.findOneAndUpdate(
      { email: 'user@moroccotravel.com' },
      {
        name: 'Test User',
        email: 'user@moroccotravel.com',
        password: 'user123',
        role: 'user'
      },
      { upsert: true, new: true }
    );
    console.log('Test user created/updated');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@moroccotravel.com / admin123');
    console.log('   User: user@moroccotravel.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();

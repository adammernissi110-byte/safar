# Morocco Travel Booking API

Production-ready REST API for a Morocco travel booking platform with payment integration, Google Maps support, and admin capabilities.

## Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **User Roles**: User and Admin role-based access control
- **Trips Management**: CRUD operations for travel trips with location data
- **Hotels Management**: CRUD operations for hotels with amenities
- **Booking System**: Trip and hotel bookings with multiple payment methods
- **Payment Integration**: Stripe (online) and Cash on Delivery (COD)
- **Google Maps**: Latitude/longitude storage for map rendering
- **Reviews System**: Rating and reviews for trips and hotels
- **Admin Dashboard**: Statistics, revenue reports, user management
- **Email Notifications**: Booking confirmations and status updates
- **Image Upload**: Cloudinary integration for image storage
- **Security**: Helmet, CORS, rate limiting, MongoDB sanitization

## Project Structure

```
/server
 ├── models/
 │   ├── User.js
 │   ├── Trip.js
 │   ├── Hotel.js
 │   ├── Booking.js
 │   └── Review.js
 ├── controllers/
 │   ├── authController.js
 │   ├── tripController.js
 │   ├── hotelController.js
 │   ├── bookingController.js
 │   ├── reviewController.js
 │   └── adminController.js
 ├── routes/
 │   ├── auth.js
 │   ├── trips.js
 │   ├── hotels.js
 │   ├── bookings.js
 │   ├── reviews.js
 │   └── admin.js
 ├── middleware/
 │   ├── auth.js
 │   └── rateLimiter.js
 ├── config/
 │   └── db.js
 ├── utils/
 │   ├── emailService.js
 │   ├── fileUpload.js
 │   └── validation.js
 ├── .env
 ├── .env.example
 └── server.js
```

## Installation

1. **Clone and navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env with your credentials:**
- MongoDB URI
- JWT Secret
- Stripe API keys
- Cloudinary credentials
- Email credentials
- Google Maps API key

5. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user (protected)
```

### Trips
```
GET    /api/trips               - Get all trips (with filters)
GET    /api/trips/location      - Get trips by location
GET    /api/trips/:id           - Get single trip
POST   /api/trips               - Create trip (admin only)
PUT    /api/trips/:id           - Update trip (admin only)
DELETE /api/trips/:id           - Delete trip (admin only)
```

### Hotels
```
GET    /api/hotels              - Get all hotels (with filters)
GET    /api/hotels/location     - Get hotels by location
GET    /api/hotels/:id          - Get single hotel
POST   /api/hotels              - Create hotel (admin only)
PUT    /api/hotels/:id          - Update hotel (admin only)
DELETE /api/hotels/:id          - Delete hotel (admin only)
```

### Bookings
```
POST   /api/bookings                    - Create booking
GET    /api/bookings                    - Get user bookings
GET    /api/bookings/:id                - Get single booking
PUT    /api/bookings/:id                - Update booking
PATCH  /api/bookings/:id                - Cancel booking
POST   /api/bookings/stripe/create-checkout - Create Stripe session
POST   /api/bookings/stripe/verify      - Verify Stripe payment
```

### Reviews
```
POST   /api/reviews             - Create review
GET    /api/reviews/trip/:tripId    - Get trip reviews
GET    /api/reviews/hotel/:hotelId  - Get hotel reviews
DELETE /api/reviews/:id        - Delete review (admin only)
```

### Admin
```
GET    /api/admin/dashboard         - Get dashboard stats
GET    /api/admin/revenue           - Get revenue report
GET    /api/admin/bookings          - Get all bookings
PUT    /api/admin/bookings/:id/status - Update booking status
GET    /api/admin/users             - Get all users
PUT    /api/admin/users/:id/role    - Update user role
```

## Query Parameters

### Trips & Hotels Filtering
- `city` - Filter by city name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `category` - Trip category (trips only)
- `starRating` - Hotel star rating (hotels only)
- `available` - Filter by availability
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Location-based Search
- `lat` - Latitude
- `lng` - Longitude
- `distance` - Max distance in meters (default: 50000)

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <your_token>
```

## Request Examples

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+212600000000"
}
```

### Create Trip (Admin)
```json
POST /api/trips
{
  "title": "Sahara Desert Adventure",
  "city": "Merzouga",
  "price": 299,
  "duration": "3 days",
  "description": "Experience the magic of the Sahara...",
  "images": ["url1", "url2"],
  "location": { "lat": 31.0802, "lng": -4.0134 },
  "category": "desert",
  "maxGuests": 8
}
```

### Create Booking
```json
POST /api/bookings
{
  "tripId": "64abc123...",
  "date": "2024-03-15",
  "endDate": "2024-03-18",
  "paymentMethod": "stripe",
  "guests": 2,
  "notes": "Special requirements..."
}
```

### Create Review
```json
POST /api/reviews
{
  "bookingId": "64abc456...",
  "tripId": "64abc123...",
  "rating": 5,
  "comment": "Amazing experience! Highly recommended."
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [ ... ]
}
```

## Database Models

### User
- name, email, password (hashed), role, phone, avatar

### Trip
- title, city, price, duration, description, images, location (lat/lng), category, maxGuests, available, rating, numReviews

### Hotel
- name, city, price, rating, images, location (lat/lng), address, amenities, rooms, available, starRating, numReviews

### Booking
- user, trip, hotel, date, endDate, status, paymentMethod, paymentStatus, stripePaymentId, guests, totalPrice, notes

### Review
- booking, user, trip, hotel, rating, comment

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| NODE_ENV | Environment (development/production) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |
| JWT_EXPIRE | JWT expiration time |
| STRIPE_SECRET_KEY | Stripe secret key |
| STRIPE_PUBLISHABLE_KEY | Stripe publishable key |
| CLOUDINARY_* | Cloudinary credentials |
| EMAIL_* | Email service credentials |
| FRONTEND_URL | Frontend application URL |
| GOOGLE_MAPS_API_KEY | Google Maps API key |

## Security Features

- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: API rate limiting (100 req/15min)
- **Auth Rate Limiting**: Login/register limiting (5 req/15min)
- **MongoDB Sanitization**: Prevent injection attacks
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth

## License

ISC

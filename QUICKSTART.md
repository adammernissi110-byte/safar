# Morocco Travel Platform - Quick Start Guide

## 🚀 Getting Started

### 1. Start MongoDB
Make sure MongoDB is running on your machine:
```bash
# Windows (if MongoDB is installed as service)
net start MongoDB

# Or run mongod manually
mongod --dbpath "C:\data\db"
```

### 2. Configure Environment Variables

**Server (.env)** - `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/morocco-travel
JWT_SECRET=morocco_travel_secret_key_2024
STRIPE_SECRET_KEY=sk_test_your_key_here
FRONTEND_URL=http://localhost:3000
```

**Client (.env.local)** - `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install --legacy-peer-deps
```

### 4. Seed Database (Optional)

Populate the database with sample trips and hotels:

```bash
cd server
npm install
node seed.js
```

This creates:
- 6 sample trips (Sahara, Marrakech, Chefchaouen, etc.)
- 6 sample hotels
- Admin user: `admin@moroccotravel.com` / `admin123`
- Test user: `user@moroccotravel.com` / `user123`

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## 📱 Features

### Frontend Features:
- ✅ Smooth scrolling animations (Framer Motion)
- ✅ Mobile-optimized responsive design
- ✅ Bottom navigation bar for mobile
- ✅ Touch-friendly interactions
- ✅ PWA ready (manifest.json)
- ✅ Image optimization
- ✅ Search & filter functionality
- ✅ Stripe payment integration
- ✅ User authentication

### Backend Features:
- ✅ RESTful API
- ✅ JWT authentication
- ✅ MongoDB with Mongoose
- ✅ Stripe payments
- ✅ Cash on Delivery option
- ✅ Google Maps coordinates
- ✅ Admin dashboard
- ✅ Review system
- ✅ Email notifications
- ✅ Rate limiting & security

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/trips` | Get all trips |
| GET | `/api/hotels` | Get all hotels |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get user bookings |
| POST | `/api/bookings/stripe/create-checkout` | Stripe payment |

---

## 📁 Project Structure

```
morocco-travel/
├── server/
│   ├── models/          # Database schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, rate limiting
│   ├── utils/           # Helpers
│   ├── config/          # DB connection
│   ├── seed.js          # Database seeder
│   └── server.js        # Entry point
│
└── client/
    ├── app/             # Next.js pages
    ├── components/      # Reusable components
    ├── store/           # Zustand state
    └── public/          # Static files
```

---

## 🎨 Mobile Optimizations

- Responsive design (mobile-first)
- Touch-friendly buttons (44px min)
- Bottom navigation for easy thumb access
- Smooth animations (60fps)
- Optimized images (WebP, lazy loading)
- PWA installable
- Safe area insets for notched devices

---

## 🔐 Test Accounts

After running `node seed.js`:

**Admin:**
- Email: `admin@moroccotravel.com`
- Password: `admin123`

**User:**
- Email: `user@moroccotravel.com`
- Password: `user123`

---

## 🛠️ Troubleshooting

**MongoDB connection error:**
```bash
# Make sure MongoDB is running
mongod --dbpath "C:\data\db"
```

**Port already in use:**
```bash
# Change PORT in server/.env
# Change NEXT_PUBLIC_API_URL in client/.env.local
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force
npm install
```

---

## 📞 Support

For issues or questions, check the README.md files in each directory.

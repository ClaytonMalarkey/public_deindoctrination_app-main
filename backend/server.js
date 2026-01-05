const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

/* =========================
   MongoDB Connection
========================= */
const connectDB = async () => {
  try {
    // Set strictQuery to false to prepare for Mongoose 7
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deindoctrinationApp',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`🏆 Leaderboard system ready with user profiles`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

/* =========================
   Routes
========================= */
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/users', userRoutes);

/* =========================
   Health Check Route
========================= */
app.get('/', (req, res) => {
  res.send('Public Deindoctrination App Backend is running 🚀');
});

/* =========================
   Server Start
========================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database loaded with tasks ready for testing`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please:`);
    console.error(`   1. Kill the process using: taskkill /PID <PID> /F`);
    console.error(`   2. Or use a different port: PORT=5001 npm run dev`);
    console.error(`   3. Or find the process: netstat -ano | findstr :${PORT}`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

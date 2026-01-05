const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const { assignRandomTasks } = require('../services/taskAssignmentService');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.isVerified = true; // Google accounts are pre-verified
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = new User({
      googleId: profile.id,
      username: profile.displayName || profile.emails[0].value.split('@')[0],
      email: profile.emails[0].value,
      isVerified: true, // Google accounts are pre-verified
      authProvider: 'google',
      profilePicture: profile.photos[0]?.value
    });
    
    await user.save();
    
    // Assign random tasks to new user
    await assignRandomTasks(user._id);
    
    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'email', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Facebook ID
    let user = await User.findOne({ facebookId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Check if user exists with same email
    if (profile.emails && profile.emails[0]) {
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Facebook account to existing user
        user.facebookId = profile.id;
        user.isVerified = true; // Facebook accounts are pre-verified
        await user.save();
        return done(null, user);
      }
    }
    
    // Create new user
    user = new User({
      facebookId: profile.id,
      username: profile.displayName || `user_${profile.id}`,
      email: profile.emails?.[0]?.value || `${profile.id}@facebook.local`,
      isVerified: true, // Facebook accounts are pre-verified
      authProvider: 'facebook',
      profilePicture: profile.photos[0]?.value
    });
    
    await user.save();
    
    // Assign random tasks to new user
    await assignRandomTasks(user._id);
    
    return done(null, user);
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
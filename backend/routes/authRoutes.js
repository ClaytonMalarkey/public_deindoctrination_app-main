// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Changed to bcryptjs to match User model
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const { assignRandomTasksToUser } = require('../services/taskAssignmentService');
const { generateOTP, sendVerificationOTP, sendPasswordResetOTP, sendLoginOTP } = require('../services/emailService');
const authMiddleware = require('../middleware/authMiddleware');

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'secretKey', 
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId }, 
    process.env.JWT_REFRESH_SECRET || 'refreshSecretKey', 
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Register route (Step 1: Send OTP)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      } else {
        // User exists but not verified, resend OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        existingUser.emailVerificationOTP = otp;
        existingUser.emailVerificationExpires = otpExpiry;
        await existingUser.save();
        
        await sendVerificationOTP(email, username, otp);
        
        return res.status(200).json({ 
          message: 'Verification OTP resent to your email',
          requiresVerification: true,
          email: email
        });
      }
    }

    // Create new user (not saved yet)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    const newUser = new User({ 
      username, 
      email, 
      password,
      emailVerificationOTP: otp,
      emailVerificationExpires: otpExpiry,
      isEmailVerified: false
    });
    
    await newUser.save();
    
    // Send verification OTP
    const emailResult = await sendVerificationOTP(email, username, otp);
    
    if (!emailResult.success) {
      // If email fails, still allow registration but notify
      console.error('Failed to send verification email:', emailResult.error);
    }
    
    console.log(`👤 New user registered (pending verification): ${username}`);
    
    res.status(201).json({ 
      message: 'Registration successful! Please check your email for verification OTP.',
      requiresVerification: true,
      email: email
    });
    
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Verify email OTP
router.post('/verify-email', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      emailVerificationOTP: otp,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Assign tasks to verified user
    const taskAssignment = await assignRandomTasksToUser(user._id, 10);
    
    if (taskAssignment.success) {
      console.log(`✅ Assigned ${taskAssignment.assignedTasks.length} tasks to verified user`);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(200).json({
      message: 'Email verified successfully!',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        level: user.level,
        isEmailVerified: user.isEmailVerified,
        tasksAssigned: taskAssignment.success ? taskAssignment.assignedTasks.length : 0
      }
    });

  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// Resend verification OTP
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email, isEmailVerified: false });

    if (!user) {
      return res.status(400).json({ message: 'User not found or already verified' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.emailVerificationOTP = otp;
    user.emailVerificationExpires = otpExpiry;
    await user.save();

    await sendVerificationOTP(email, user.username, otp);

    res.status(200).json({ message: 'Verification OTP resent successfully' });

  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route (Step 1: Check credentials and send OTP)
router.post('/login', async (req, res) => {
  const { email, password, rememberMe = false } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: 'Account temporarily locked due to too many failed login attempts. Please try again later.' 
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({ 
        message: 'Please verify your email first',
        requiresVerification: true,
        email: email
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate and send login OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP temporarily (you might want to use Redis for this)
    user.emailVerificationOTP = otp; // Reusing field for login OTP
    user.emailVerificationExpires = otpExpiry;
    await user.save();

    await sendLoginOTP(email, user.username, otp);

    res.status(200).json({
      message: 'Login OTP sent to your email',
      requiresOTP: true,
      email: email,
      rememberMe: rememberMe
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify login OTP
router.post('/verify-login', async (req, res) => {
  const { email, otp, rememberMe = false } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      emailVerificationOTP: otp,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    
    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    await user.save();

    // Generate tokens
    const tokenExpiry = rememberMe ? '30d' : '24h';
    const accessToken = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'secretKey', 
      { expiresIn: tokenExpiry }
    );

    const { refreshToken } = generateTokens(user._id);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        level: user.level,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (err) {
    console.error('Login verification error:', err);
    res.status(500).json({ message: 'Server error during login verification' });
  }
});

// Forgot password (Step 1: Send reset OTP)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({ 
        message: 'If an account with this email exists, a password reset OTP has been sent.' 
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.passwordResetOTP = otp;
    user.passwordResetExpires = otpExpiry;
    await user.save();

    await sendPasswordResetOTP(email, user.username, otp);

    res.status(200).json({ 
      message: 'If an account with this email exists, a password reset OTP has been sent.',
      email: email
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password with OTP
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save middleware
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    
    // Reset login attempts
    await user.resetLoginAttempts();
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecretKey');
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req, res) => {
  // In a production app, you'd want to blacklist the token
  res.status(200).json({ message: 'Logged out successfully' });
});

// OAuth Routes

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Generate JWT tokens for the authenticated user
      const { accessToken, refreshToken } = generateTokens(req.user._id);
      
      // Redirect to frontend with tokens
      res.redirect(`http://localhost:3000/auth/success?token=${accessToken}&refresh=${refreshToken}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        points: req.user.points,
        level: req.user.level
      }))}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('http://localhost:3000/login?error=oauth_failed');
    }
  }
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      // Generate JWT tokens for the authenticated user
      const { accessToken, refreshToken } = generateTokens(req.user._id);
      
      // Redirect to frontend with tokens
      res.redirect(`http://localhost:3000/auth/success?token=${accessToken}&refresh=${refreshToken}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        points: req.user.points,
        level: req.user.level
      }))}`);
    } catch (error) {
      console.error('Facebook OAuth callback error:', error);
      res.redirect('http://localhost:3000/login?error=oauth_failed');
    }
  }
);

module.exports = router;

// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      // Password is required only if not using OAuth
      return !this.googleId && !this.facebookId;
    },
  },
  // OAuth fields
  googleId: {
    type: String,
    sparse: true,
  },
  facebookId: {
    type: String,
    sparse: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local',
  },
  profilePicture: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  // Rename for consistency
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationOTP: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  passwordResetOTP: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  assignedTasks: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  completedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, {
  timestamps: true
});

// Hash the password before saving the user (only if password exists)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check if entered password matches the stored hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false; // OAuth users don't have passwords
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

module.exports = mongoose.model('User', userSchema);

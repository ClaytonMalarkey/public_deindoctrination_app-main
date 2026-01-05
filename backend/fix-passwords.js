const mongoose = require('mongoose');
const User = require('./models/User');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deindoctrinationApp',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const fixUserPasswords = async () => {
  try {
    console.log('\n🔧 Password Fix Utility');
    console.log('='.repeat(40));
    console.log('This will reset passwords for users who cannot login due to encryption issues.');
    
    // Get all users
    const users = await User.find({}).select('username email password');
    console.log(`\n📊 Found ${users.length} users in database`);
    
    if (users.length === 0) {
      console.log('No users found.');
      return;
    }
    
    console.log('\n🔑 Setting default password "password123" for all users');
    console.log('⚠️  Users should change their passwords after logging in');
    
    let usersUpdated = 0;
    
    for (const user of users) {
      try {
        // Set a default password that will be properly hashed by the pre-save middleware
        user.password = 'password123';
        await user.save(); // This will trigger the pre-save middleware to hash the password
        
        console.log(`✅ Updated password for: ${user.username}`);
        usersUpdated++;
      } catch (error) {
        console.log(`❌ Failed to update ${user.username}: ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(40));
    console.log(`🎉 Password fix complete!`);
    console.log(`📊 Users processed: ${users.length}`);
    console.log(`🔄 Users updated: ${usersUpdated}`);
    console.log(`🔑 Default password: password123`);
    console.log(`⚠️  All users should change their passwords after logging in`);
    console.log('='.repeat(40));
    
  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
  } finally {
    process.exit(0);
  }
};

const main = async () => {
  await connectDB();
  await fixUserPasswords();
};

main();
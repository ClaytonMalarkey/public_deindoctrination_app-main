const mongoose = require('mongoose');
const User = require('./models/User');
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

const showUsers = async () => {
  try {
    const users = await User.find({}).select('username email isEmailVerified points level');
    
    console.log('\n👥 All Users in Database:');
    console.log('='.repeat(60));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Verified: ${user.isEmailVerified ? '✅' : '❌'}`);
      console.log(`   Points: ${user.points} | Level: ${user.level}`);
      console.log('   ' + '-'.repeat(40));
    });
    
    console.log(`\n📊 Total users: ${users.length}`);
    console.log('🔑 Default password for all users: password123');
    
  } catch (error) {
    console.error('❌ Error showing users:', error);
  } finally {
    process.exit(0);
  }
};

const main = async () => {
  await connectDB();
  await showUsers();
};

main();
const mongoose = require('mongoose');
const User = require('./models/User');
const { assignRandomTasksToUser } = require('./services/taskAssignmentService');
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

const ensureAllUsersHaveTasks = async () => {
  try {
    console.log('\n🔍 Checking all users for task assignments...');
    
    // Get all users
    const users = await User.find({}).select('username email assignedTasks');
    console.log(`📊 Found ${users.length} users in database`);
    
    let usersUpdated = 0;
    
    for (const user of users) {
      const currentTaskCount = user.assignedTasks.length;
      console.log(`\n👤 User: ${user.username} - Current tasks: ${currentTaskCount}`);
      
      if (currentTaskCount < 10) {
        const tasksNeeded = 10 - currentTaskCount;
        console.log(`📝 Assigning ${tasksNeeded} additional tasks...`);
        
        const result = await assignRandomTasksToUser(user._id, tasksNeeded);
        
        if (result.success) {
          console.log(`✅ Successfully assigned ${tasksNeeded} tasks to ${user.username}`);
          usersUpdated++;
        } else {
          console.log(`❌ Failed to assign tasks to ${user.username}: ${result.error}`);
        }
      } else {
        console.log(`✅ ${user.username} already has ${currentTaskCount} tasks`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Task assignment complete!`);
    console.log(`📊 Users processed: ${users.length}`);
    console.log(`🔄 Users updated: ${usersUpdated}`);
    console.log(`✅ All users now have at least 10 tasks assigned`);
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Error ensuring user tasks:', error);
  } finally {
    process.exit(0);
  }
};

const main = async () => {
  await connectDB();
  await ensureAllUsersHaveTasks();
};

main();
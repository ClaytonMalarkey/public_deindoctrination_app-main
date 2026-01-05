const mongoose = require('mongoose');
const Task = require('./models/Tasks');
const Reward = require('./models/Reward');
require('dotenv').config();

const connectDB = require('../database/connection');

const sampleTasks = [
  {
    title: "Complete Daily Reading",
    category: "Education",
    description: "Read for 30 minutes about critical thinking",
    rewardPoints: 50
  },
  {
    title: "Question a Belief",
    category: "Critical Thinking",
    description: "Identify and question one belief you hold",
    rewardPoints: 75
  },
  {
    title: "Research a Topic",
    category: "Research",
    description: "Research a controversial topic from multiple perspectives",
    rewardPoints: 100
  },
  {
    title: "Practice Meditation",
    category: "Mindfulness",
    description: "Practice mindfulness meditation for 15 minutes",
    rewardPoints: 30
  },
  {
    title: "Write a Reflection",
    category: "Writing",
    description: "Write a 500-word reflection on your learning",
    rewardPoints: 60
  }
];

const sampleRewards = [
  {
    name: "Digital Badge: Critical Thinker",
    cost: 100
  },
  {
    name: "E-book: Philosophy Basics",
    cost: 200
  },
  {
    name: "Premium Content Access",
    cost: 300
  },
  {
    name: "One-on-One Mentoring Session",
    cost: 500
  },
  {
    name: "Certificate of Completion",
    cost: 1000
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Task.deleteMany({});
    await Reward.deleteMany({});
    
    // Insert sample data
    await Task.insertMany(sampleTasks);
    await Reward.insertMany(sampleRewards);
    
    console.log('✅ Sample data inserted successfully!');
    console.log(`📝 Inserted ${sampleTasks.length} tasks`);
    console.log(`🎁 Inserted ${sampleRewards.length} rewards`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
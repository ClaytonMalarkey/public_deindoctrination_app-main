const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  taskName: { 
    type: String, 
    required: true 
  },
  taskCategory: { 
    type: String, 
    required: true 
  },
  taskDescription: { 
    type: String, 
    required: true 
  },
  taskCheck: { 
    type: String, 
    default: '' 
  },
  taskVirtualReward: { 
    type: Number, 
    default: 0 
  },
  taskRealReward: { 
    type: String, 
    default: '' 
  },
  // Legacy fields for backward compatibility
  title: { 
    type: String 
  },
  category: { 
    type: String 
  },
  description: { 
    type: String 
  },
  rewardPoints: { 
    type: Number, 
    default: 10 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
}, {
  timestamps: true
});

// Create indexes for better performance
TaskSchema.index({ taskId: 1 });
TaskSchema.index({ taskCategory: 1 });

module.exports = mongoose.model('Task', TaskSchema);

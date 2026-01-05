// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get any user's public profile and tasks
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username points level assignedTasks completedTasks createdAt')
      .populate('assignedTasks.taskId', 'taskName taskCategory taskDescription taskVirtualReward')
      .populate('completedTasks', 'taskName taskCategory taskVirtualReward');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate stats
    const totalTasks = user.assignedTasks.length;
    const completedTasksCount = user.assignedTasks.filter(task => task.completed).length;
    const pendingTasksCount = totalTasks - completedTasksCount;
    const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        points: user.points,
        level: user.level,
        joinedDate: user.createdAt
      },
      taskStats: {
        total: totalTasks,
        completed: completedTasksCount,
        pending: pendingTasksCount,
        completionRate: completionRate
      },
      assignedTasks: user.assignedTasks,
      recentCompletedTasks: user.completedTasks.slice(-5) // Last 5 completed tasks
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to update user points
router.put('/points', authMiddleware, async (req, res) => {
  try {
    const { points } = req.body;
    const user = await User.findById(req.user._id);
    
    user.points = points;
    await user.save();
    
    res.json({ 
      message: 'Points updated successfully',
      points: user.points 
    });
  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

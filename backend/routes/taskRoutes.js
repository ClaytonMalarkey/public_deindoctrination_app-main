const express = require('express');
const { getTasks, completeTask } = require('../controllers/taskController');
const { getUserAssignedTasks, completeUserTask, assignMoreTasksIfNeeded } = require('../services/taskAssignmentService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all tasks (public)
router.get('/', getTasks);

// Get user's assigned tasks (protected)
router.get('/my-tasks', authMiddleware, async (req, res) => {
  try {
    const result = await getUserAssignedTasks(req.user._id);
    
    if (result.success) {
      res.json({
        success: true,
        tasks: result.tasks,
        summary: {
          total: result.totalTasks,
          completed: result.completedTasks,
          pending: result.pendingTasks
        }
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error getting user tasks:', error);
    res.status(500).json({ message: 'Error retrieving user tasks' });
  }
});

// Complete a user's assigned task (protected)
router.post('/complete/:taskId', authMiddleware, async (req, res) => {
  try {
    const result = await completeUserTask(req.user._id, req.params.taskId);
    
    if (result.success) {
      // Check if user needs more tasks assigned
      await assignMoreTasksIfNeeded(req.user._id);
      
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ message: 'Error completing task' });
  }
});

// Legacy route for backward compatibility
router.post('/:id/complete', completeTask);

module.exports = router;

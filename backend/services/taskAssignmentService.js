const Task = require('../models/Tasks');
const User = require('../models/User');

/**
 * Assigns random tasks to a user
 * @param {string} userId - The user's ID
 * @param {number} numberOfTasks - Number of tasks to assign (default: 10)
 * @returns {Promise<Array>} - Array of assigned tasks
 */
const assignRandomTasksToUser = async (userId, numberOfTasks = 10) => {
  try {
    console.log(`🎯 Assigning ${numberOfTasks} random tasks to user ${userId}`);
    
    // Get total number of tasks available
    const totalTasks = await Task.countDocuments();
    console.log(`📊 Total tasks available: ${totalTasks}`);
    
    if (totalTasks < numberOfTasks) {
      console.log(`⚠️ Only ${totalTasks} tasks available, assigning all of them`);
      numberOfTasks = totalTasks;
    }
    
    // Get random tasks using MongoDB aggregation
    const randomTasks = await Task.aggregate([
      { $sample: { size: numberOfTasks } }
    ]);
    
    console.log(`✅ Selected ${randomTasks.length} random tasks`);
    
    // Prepare assigned tasks array
    const assignedTasks = randomTasks.map(task => ({
      taskId: task._id,
      assignedAt: new Date(),
      completed: false
    }));
    
    // Update user with assigned tasks
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          assignedTasks: { $each: assignedTasks } 
        }
      },
      { new: true }
    ).populate('assignedTasks.taskId');
    
    console.log(`🎉 Successfully assigned ${assignedTasks.length} tasks to user`);
    
    return {
      success: true,
      assignedTasks: updatedUser.assignedTasks,
      message: `Successfully assigned ${assignedTasks.length} tasks`
    };
    
  } catch (error) {
    console.error('❌ Error assigning tasks to user:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to assign tasks'
    };
  }
};

/**
 * Get user's assigned tasks
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of user's assigned tasks
 */
const getUserAssignedTasks = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate('assignedTasks.taskId')
      .select('assignedTasks');
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    return {
      success: true,
      tasks: user.assignedTasks,
      totalTasks: user.assignedTasks.length,
      completedTasks: user.assignedTasks.filter(task => task.completed).length,
      pendingTasks: user.assignedTasks.filter(task => !task.completed).length
    };
    
  } catch (error) {
    console.error('❌ Error getting user assigned tasks:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to get assigned tasks'
    };
  }
};

/**
 * Complete a task for a user
 * @param {string} userId - The user's ID
 * @param {string} taskId - The task's ID
 * @returns {Promise<Object>} - Result of task completion
 */
const completeUserTask = async (userId, taskId) => {
  try {
    console.log(`✅ Completing task ${taskId} for user ${userId}`);
    
    // Find the user and the specific assigned task
    const user = await User.findById(userId).populate('assignedTasks.taskId');
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // Find the assigned task
    const assignedTask = user.assignedTasks.find(
      task => task.taskId._id.toString() === taskId && !task.completed
    );
    
    if (!assignedTask) {
      return { success: false, message: 'Task not found or already completed' };
    }
    
    // Mark task as completed
    assignedTask.completed = true;
    assignedTask.completedAt = new Date();
    
    // Add points to user
    const taskPoints = assignedTask.taskId.taskVirtualReward || assignedTask.taskId.rewardPoints || 10;
    user.points += taskPoints;
    
    // Update level based on points (every 1000 points = 1 level)
    user.level = Math.floor(user.points / 1000) + 1;
    
    // Add to completed tasks array
    if (!user.completedTasks.includes(taskId)) {
      user.completedTasks.push(taskId);
    }
    
    await user.save();
    
    console.log(`🎉 Task completed! User earned ${taskPoints} points`);
    
    return {
      success: true,
      message: 'Task completed successfully!',
      pointsEarned: taskPoints,
      totalPoints: user.points,
      newLevel: user.level,
      taskName: assignedTask.taskId.taskName || assignedTask.taskId.title
    };
    
  } catch (error) {
    console.error('❌ Error completing task:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to complete task'
    };
  }
};

/**
 * Assign more tasks to a user if they have completed most of their tasks
 * @param {string} userId - The user's ID
 * @param {number} threshold - Minimum number of pending tasks before assigning more
 * @returns {Promise<Object>} - Result of task assignment
 */
const assignMoreTasksIfNeeded = async (userId, threshold = 3) => {
  try {
    const userTasks = await getUserAssignedTasks(userId);
    
    if (!userTasks.success) {
      return userTasks;
    }
    
    if (userTasks.pendingTasks <= threshold) {
      console.log(`🔄 User has only ${userTasks.pendingTasks} pending tasks, assigning more...`);
      return await assignRandomTasksToUser(userId, 10);
    }
    
    return {
      success: true,
      message: `User has ${userTasks.pendingTasks} pending tasks, no need to assign more`
    };
    
  } catch (error) {
    console.error('❌ Error checking if more tasks needed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  assignRandomTasksToUser,
  getUserAssignedTasks,
  completeUserTask,
  assignMoreTasksIfNeeded
};
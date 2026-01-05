const Task = require('../models/Tasks');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ completed: false });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error completing task' });
  }
};

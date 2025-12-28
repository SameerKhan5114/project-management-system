const mongoose = require('mongoose');
const Task = require('../models/Task');

const validTransitions = {
  Todo: ['In Progress'],
  'In Progress': ['Blocked', 'Done'],
  Blocked: ['In Progress'],
  Done: []
};

const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High'];
const ALLOWED_STATUSES = ['Todo', 'In Progress', 'Blocked', 'Done'];

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status = 'Todo',
      assignedUser,
      dueDate
    } = req.body;

    // 1️⃣ Required field validation
    if (!title || !priority) {
      return res.status(400).json({
        message: 'Title and priority are required'
      });
    }

    // 2️⃣ Enum validation: Priority
    if (!ALLOWED_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        message: `Invalid priority. Allowed: ${ALLOWED_PRIORITIES.join(', ')}`
      });
    }

    // 3️⃣ Enum validation: Status
    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    // 4️⃣ assignedUser must be valid ObjectId
    if (assignedUser && !mongoose.Types.ObjectId.isValid(assignedUser)) {
      return res.status(400).json({
        message: 'Invalid assignedUser ID'
      });
    }

    // 5️⃣ Due date validation
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({
        message: 'Invalid dueDate format'
      });
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      return res.status(400).json({
        message: 'Due date cannot be in the past'
      });
    }

    // 6️⃣ Role-based rule: Only Admin / Manager can assign users
    if (assignedUser && !['Admin', 'Manager'].includes(req.user.role)) {
      return res.status(403).json({
        message: 'Only Admin or Manager can assign tasks'
      });
    }

    // 7️⃣ Create task
    const task = await Task.create({
      title,
      description,
      priority,
      status,
      assignedUser,
      dueDate
    });

    // 8️⃣ Emit real-time event
    req.io.emit('taskCreated', task);

    res.status(201).json(task);
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({
      message: 'Failed to create task'
    });
  }
};




exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate task id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2️⃣ Developer can update ONLY assigned tasks
    if (
      req.user.role === 'Developer' &&
      task.assignedUser?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: 'Developers can update only their assigned tasks'
      });
    }

    const { status, priority, assignedUser, dueDate } = req.body;

    // 3️⃣ Status transition validation
    if (status) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      if (!validTransitions[task.status].includes(status)) {
        return res.status(400).json({
          message: `Invalid status transition from ${task.status} to ${status}`
        });
      }
    }

    // 4️⃣ Priority validation
    if (priority && !ALLOWED_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value' });
    }

    // 5️⃣ assignedUser validation (Admin / Manager only)
    if (assignedUser) {
      if (!['Admin', 'Manager'].includes(req.user.role)) {
        return res.status(403).json({
          message: 'Only Admin or Manager can reassign tasks'
        });
      }

      if (!mongoose.Types.ObjectId.isValid(assignedUser)) {
        return res.status(400).json({ message: 'Invalid assignedUser ID' });
      }
    }

    // 6️⃣ Due date validation
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ message: 'Invalid dueDate format' });
    }

    if (dueDate && new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: 'Due date cannot be in the past' });
    }

    // 7️⃣ Apply updates
    Object.assign(task, req.body);
    await task.save();

    // 8️⃣ Emit real-time update
    req.io.emit('taskUpdated', task);

    res.json(task);
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};

    // 1️⃣ Status filter
    if (status) {
      query.status = status;
    }

    // 2️⃣ Developer sees only assigned tasks
    if (req.user.role === 'Developer') {
      query.assignedUser = req.user.id;
    }

    // 3️⃣ Pagination
    const tasks = await Task.find(query)
      .populate('assignedUser', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      page: Number(page),
      limit: Number(limit),
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};


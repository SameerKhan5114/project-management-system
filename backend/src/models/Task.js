
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'] },
  status: { type: String, enum: ['Todo', 'In Progress', 'Blocked', 'Done'], default: 'Todo' },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date
}, { timestamps: true });

TaskSchema.index({ status: 1 });
TaskSchema.index({ assignedUser: 1 });

module.exports = mongoose.model('Task', TaskSchema);

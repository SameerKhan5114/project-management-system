
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Manager', 'Developer'], default: 'Developer' }
});

module.exports = mongoose.model('User', UserSchema);

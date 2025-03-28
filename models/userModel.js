const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', 
    default: null, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String, // Campo para almacenar el refresh token
    default: null,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
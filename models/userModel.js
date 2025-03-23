const mongoose = require('mongoose');

// Definición del esquema del usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
    enum: ['user', 'admin'], // Roles disponibles
    default: 'user', // Por defecto, todos los usuarios son "user"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Crear el modelo
const User = mongoose.model('User', userSchema);

module.exports = User;
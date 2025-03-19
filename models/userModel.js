const mongoose = require('mongoose');

// Definición del esquema del usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: null, // Opcional: puedes agregar una URL para la foto de perfil
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Crear el modelo
const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose');
const User = require('./userModel'); // Asegúrate de importar el modelo de usuario

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,
  },
  emergencyNumber: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

// Middleware para eliminar el usuario relacionado al eliminar un cliente
clientSchema.pre('findOneAndDelete', async function (next) {
  const client = await this.model.findOne(this.getQuery()); // Obtener el cliente que se va a eliminar
  if (client && client.user) {
    await User.findByIdAndDelete(client.user); // Eliminar el usuario relacionado
  }
  next();
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
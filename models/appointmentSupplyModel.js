const mongoose = require('mongoose');

const appointmentSupplySchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment', // Referencia al modelo de citas
    required: true,
  },
  supply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supply', // Referencia al modelo de suministros
    required: true,
  },
  quantityUsed: {
    type: Number, 
    required: true,
    min: 1,
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

module.exports = mongoose.model('AppointmentSupply', appointmentSupplySchema);
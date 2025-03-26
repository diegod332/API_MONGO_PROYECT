const mongoose = require('mongoose');

const supplySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, 
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null,
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

module.exports = mongoose.model('Supply', supplySchema);
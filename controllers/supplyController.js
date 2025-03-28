const moment = require('moment-timezone');
const Supply = require('../models/supplyModel');


// Obtener todos los insumos
exports.getAllSupplies = async (req, res) => {
  try {
    const supplies = await Supply.find({});

    // Formatear las fechas antes de enviarlas al frontend
    const formattedSupplies = supplies.map((supply) => ({
      ...supply._doc,
      expirationDate:moment(supply.expirationDate)
              .tz('America/Mexico_City')
              .format('YYYY-MM-DD'), 
    }));

    res.status(200).json({ status: 'success', data: formattedSupplies });
  } catch (error) {
    console.error('Error al obtener los insumos:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los insumos', error: error.message });
  }
};

// Obtener un insumo por ID
exports.getSupplyById = async (req, res) => {
  const { id } = req.params;
  try {
    const supply = await Supply.findOne({ _id: id,}); 
    if (!supply) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }
    res.status(200).json({ status: 'success', data: supply });
  } catch (error) {
    console.error('Error al obtener el insumo:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener el insumo', error: error.message });
  }
};

// Crear un nuevo insumo
exports.createSupply = async (req, res) => {
  const { name, quantity, expirationDate, price } = req.body;

  // Validar campos requeridos
  if (!name || !quantity || !expirationDate || !price) {
    return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
  }

  try {
    // Convertir la fecha al formato ISO
    const formattedDate = moment(expirationDate, 'YYYY-MM-DD').toDate();

    const newSupply = new Supply({
      name,
      quantity,
      expirationDate: formattedDate,
      price,
    });
    const savedSupply = await newSupply.save();
    res.status(201).json({ status: 'success', data: savedSupply });
  } catch (error) {
    console.error('Error al crear el insumo:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear el insumo', error: error.message });
  }
};

// Actualizar un insumo
exports.updateSupply = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, expirationDate, price } = req.body;

  try {

    const formattedDate = expirationDate ? moment(expirationDate, 'YYYY-MM-DD').toDate() : undefined;

    const updatedSupply = await Supply.findOneAndUpdate(
      { _id: id,},
      { name, quantity, expirationDate: formattedDate, price, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedSupply) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado o ya eliminado' });
    }
    res.status(200).json({ status: 'success', data: updatedSupply });
  } catch (error) {
    console.error('Error al actualizar el insumo:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar el insumo', error: error.message });
  }
};

// Eliminar un insumo
exports.deleteSupply = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSupply = await Supply.findByIdAndDelete(id); 

    if (!deletedSupply) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado' });
    }

    res.status(200).json({ status: 'success', message: 'Insumo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el insumo:', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar el insumo', error: error.message });
  }
};
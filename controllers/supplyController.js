const Supply = require('../models/supplyModel');

// Obtener todos los insumos
exports.getAllSupplies = async (req, res) => {
  try {
    const supplies = await Supply.find({ deletedAt: null }); // Filtrar insumos no eliminados
    if (supplies.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No hay insumos disponibles' });
    }
    res.status(200).json({ status: 'success', data: supplies });
  } catch (error) {
    console.error('Error al obtener los insumos:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los insumos', error: error.message });
  }
};

// Obtener un insumo por ID
exports.getSupplyById = async (req, res) => {
  const { id } = req.params;
  try {
    const supply = await Supply.findOne({ _id: id, deletedAt: null }); // Buscar insumo no eliminado
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
    const newSupply = new Supply({
      name,
      quantity,
      expirationDate,
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
    const updatedSupply = await Supply.findOneAndUpdate(
      { _id: id, deletedAt: null }, // Buscar insumo no eliminado
      { name, quantity, expirationDate, price, updatedAt: Date.now() },
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

// Eliminar un insumo (eliminación lógica)
exports.deleteSupply = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSupply = await Supply.findOneAndUpdate(
      { _id: id, deletedAt: null }, // Buscar insumo no eliminado
      { deletedAt: Date.now() }, // Marcar como eliminado
      { new: true }
    );
    if (!deletedSupply) {
      return res.status(404).json({ status: 'error', message: 'Insumo no encontrado o ya eliminado' });
    }
    res.status(200).json({ status: 'success', message: 'Insumo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el insumo:', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar el insumo', error: error.message });
  }
};
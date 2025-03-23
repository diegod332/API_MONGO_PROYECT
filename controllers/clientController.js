const Client = require('../models/clientModel');

// Obtener todos los clientes
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({ deletedAt: null }); // Filtrar clientes no eliminados
    if (clients.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No hay clientes disponibles' });
    }
    res.status(200).json({ status: 'success', data: clients });
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los clientes', error: error.message });
  }
};
exports.getClientById = async (req, res) => {
    try {
      const client = await Client.findOne({ _id: req.params.id, deletedAt: null });
      if (!client) {
        return res.status(404).json({ status: 'error', message: 'Cliente no encontrado' });
      }
      res.status(200).json({ status: 'success', data: client });
    } catch (error) {
      console.error('Error al obtener el cliente:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener el cliente', error: error.message });
    }
  };

  // Obtener clientes para dropdown
  exports.getClientsForDropdown = async (req, res) => {
    try {
      const clients = await Client.find({ deletedAt: null }).select('firstName middleName lastName emergencyNumber');
      const formattedClients = clients.map(client => ({
        id: client._id,
        fullName: `${client.firstName} ${client.middleName} ${client.lastName}`,
        emergencyNumber: client.emergencyNumber,
      }));
      res.status(200).json({ status: 'success', data: formattedClients });
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener los clientes', error: error.message });
    }
  };

// Crear un cliente
exports.createClient = async (req, res) => {
  const { firstName, lastName, middleName, emergencyNumber, birthDate, totalAppointments } = req.body;

  // Validar campos requeridos
  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El primer nombre es obligatorio y debe ser un texto válido' });
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El apellido es obligatorio y debe ser un texto válido' });
  }
  if (!middleName || typeof middleName !== 'string' || middleName.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El segundo nombre es obligatorio y debe ser un texto válido' });
  }
  if (!emergencyNumber || typeof emergencyNumber !== 'string' || emergencyNumber.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El número de emergencia es obligatorio y debe ser un texto válido' });
  }
  if (!birthDate || isNaN(Date.parse(birthDate))) {
    return res.status(400).json({ status: 'error', message: 'La fecha de nacimiento es obligatoria y debe ser válida' });
  }

  try {
    const newClient = new Client({
      firstName,
      lastName,
      middleName,
      emergencyNumber,
      birthDate,
      totalAppointments: totalAppointments || 0, // Valor por defecto si no se proporciona
    });
    const savedClient = await newClient.save();
    res.status(201).json({ status: 'success', data: savedClient });
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear el cliente', error: error.message });
  }
};

// Actualizar un cliente
exports.updateClient = async (req, res) => {
  const { firstName, lastName, middleName, emergencyNumber, birthDate, totalAppointments } = req.body;

  // Validar campos requeridos
  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El primer nombre es obligatorio y debe ser un texto válido' });
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El apellido es obligatorio y debe ser un texto válido' });
  }
  if (!middleName || typeof middleName !== 'string' || middleName.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El segundo nombre es obligatorio y debe ser un texto válido' });
  }
  if (!emergencyNumber || typeof emergencyNumber !== 'string' || emergencyNumber.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El número de emergencia es obligatorio y debe ser un texto válido' });
  }
  if (!birthDate || isNaN(Date.parse(birthDate))) {
    return res.status(400).json({ status: 'error', message: 'La fecha de nacimiento es obligatoria y debe ser válida' });
  }

  try {
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null }, // Buscar cliente no eliminado
      { firstName, lastName, middleName, emergencyNumber, birthDate, totalAppointments, updatedAt: Date.now() },
      { new: true } // Retornar el cliente actualizado
    );

    if (!updatedClient) {
      return res.status(404).json({
        status: 'error',
        message: 'Cliente no encontrado o ya eliminado',
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedClient,
    });
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el cliente',
      error: error.message,
    });
  }
};

// Eliminar un cliente (eliminación lógica)
exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null }, // Buscar cliente no eliminado
      { deletedAt: Date.now() }, // Marcar como eliminado
      { new: true }
    );

    if (!deletedClient) {
      return res.status(404).json({
        status: 'error',
        message: 'Cliente no encontrado o ya eliminado',
      });
    }

    res.status(200).json({ status: 'success', message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el cliente',
      error: error.message,
    });
  }
};
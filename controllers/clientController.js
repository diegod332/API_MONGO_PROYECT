const Client = require('../models/clientModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Obtener todos los clientes
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({}); 
    if (clients.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No hay clientes disponibles' });
    }
    res.status(200).json({ status: 'success', data: clients });
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los clientes', error: error.message });
  }
};

// Obtener un cliente por ID
exports.getClientById = async (req, res) => {
    try {
      const client = await Client.findOne({ _id: req.params.id});
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
      const clients = await Client.find({}).select('firstName middleName lastName emergencyNumber');
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


  exports.createClient = async (req, res) => {
    const { firstName, lastName, middleName, emergencyNumber, email, password } = req.body;
  
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
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({ status: 'error', message: 'El correo electrónico es obligatorio y debe ser válido' });
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ status: 'error', message: 'La contraseña es obligatoria y debe ser válida' });
    }
  
    try {
      // Verificar si el correo ya está registrado
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ status: 'error', message: 'El correo ya está registrado' });
      }
  
      // Crear el usuario
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        role: 'user', // Rol predeterminado para clientes
      });
      const savedUser = await newUser.save();
  
      // Crear el cliente vinculado al usuario
      const newClient = new Client({
        firstName,
        lastName,
        middleName,
        emergencyNumber,
        user: savedUser._id, // Relacionar con el usuario recién creado
      });
      const savedClient = await newClient.save();
  
      res.status(201).json({
        status: 'success',
        message: 'Cliente y usuario creados exitosamente',
        client: savedClient,
        user: savedUser,
      });
    } catch (error) {
      console.error('Error al crear el cliente y usuario:', error);
      res.status(500).json({ status: 'error', message: 'Error al crear el cliente y usuario', error: error.message });
    }
  };
// Actualizar un cliente
exports.updateClient = async (req, res) => {
  const { firstName, lastName, middleName, emergencyNumber } = req.body;

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

  try {
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id},
      { firstName, lastName, middleName, emergencyNumber, updatedAt: Date.now() },
      { new: true } 
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

// Eliminar un cliente
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedClient = await Client.findByIdAndDelete(id); 

    if (!deletedClient) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};
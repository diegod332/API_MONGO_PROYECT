const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Client = require('../models/clientModel'); 


exports.register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, middleName, emergencyNumber } = req.body;

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Por favor ingrese un email válido' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Validar longitud de la contraseña
    if (password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 9 caracteres' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || 'user', // Si no se especifica, el rol será "user"
    });
    const savedUser = await newUser.save();

    // Si el rol es "user", crear un cliente vinculado
    if (role === 'user' || !role) {
      if (!firstName || !lastName || !middleName || !emergencyNumber) {
        return res.status(400).json({ message: 'Los datos del cliente son obligatorios para usuarios con rol "user"' });
      }

      const newClient = new Client({
        firstName,
        lastName,
        middleName,
        emergencyNumber,
        user: savedUser._id, // Relacionar con el usuario recién creado
      });
      const savedClient = await newClient.save();

      // Actualizar el usuario con la referencia al cliente
      savedUser.client = savedClient._id;
      await savedUser.save();

      return res.status(201).json({
        message: 'Usuario y cliente registrados exitosamente',
        user: savedUser,
        client: savedClient,
      });
    }

    // Si el rol no es "user", solo se crea el usuario
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: savedUser,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};
// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Generar refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');

    // Guardar el refresh token en la base de datos o en memoria
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken, // Enviar el refresh token al cliente
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT con el rol incluido
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Incluir el rol en el token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Incluir el rol en la respuesta
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    // Buscar al usuario por su ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar al usuario
    await user.remove();

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Usa el ID del token
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const userProfile = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      };
  
      res.status(200).json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
    }
  };
  
  exports.refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;
  
      // Verificar si el refresh token existe
      const user = await User.findOne({ refreshToken });
      if (!user) {
        return res.status(403).json({ message: 'Refresh token inválido' });
      }
  
      // Generar un nuevo token JWT
      const newToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({
        token: newToken,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.logout = async (req, res) => {
    try {
      const { refreshToken } = req.body;
  
      // Eliminar el refresh token del usuario
      const user = await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ message: 'Cierre de sesión exitoso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
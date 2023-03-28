import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from '../models/user.js'
import {UserMongoDao} from '../dao/user.mongo.dao.js'

const authController = {};
const userMongoDao = new UserMongoDao();

// Registro de usuario
authController.register = async (req, res) => {
    try {
      // Obtener datos del usuario desde el cuerpo de la solicitud
      const { name, email, password } = req.body;
      const userDao = new UserMongoDao();
      // Verificar si el usuario ya existe en la base de datos
      const existingUser = await userDao.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
  
      // Crear un nuevo usuario con los datos proporcionados
      const newUser = new User({
          name,
          email,
          password: await bcrypt.hash(password, 10), // Hashear la contraseña antes de guardarla
        });
  
      // Guardar el usuario en la base de datos
      await userDao.create(newUser);
  
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Ocurrió un error al registrar el usuario' });
    }
  }
  

// Inicio de sesión de usuario
authController.login = async (req, res) => {
  try {
    // Obtener datos del usuario desde el cuerpo de la solicitud
    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = await userMongoDao.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si la contraseña es correcta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar un token JWT para el usuario
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'SECRET_KEY',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión' });
  }
};

// Cierre de sesión de usuario
authController.logout = (req, res) => {
  res.status(200).json({ message: 'Cierre de sesión exitoso' });
};

export default authController;
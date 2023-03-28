import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from '../models/user.js'
import {UserMongoDao} from '../dao/user.mongo.dao.js'

const authController = {};
const userMongoDao = new UserMongoDao();


authController.register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const userDao = new UserMongoDao();
      // Verificar si el usuario ya existe en la base de datos
      const existingUser = await userDao.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
  
      const newUser = new User({
          name,
          email,
          password: await bcrypt.hash(password, 10), // Hashear la contraseña antes de guardarla
        });
  
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

    const { email, password } = req.body;


    const user = await userMongoDao.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

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

authController.logout = (req, res) => {
  res.status(200).json({ message: 'Cierre de sesión exitoso' });
};

export default authController;
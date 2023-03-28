import bcrypt  from'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import UserMongoDao from '../dao/user.mongo.dao.js'
// Registro de usuario
const userMongoDao = new UserMongoDao();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await userMongoDao.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    // Hashea la contraseña del usuario antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      name,
      email,
      password: hashedPassword,
    };
    // Crea al usuario en la base de datos
    const newUser = await userMongoDao.create(user);
    res.status(201).json({ message: 'El usuario ha sido creado', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Algo salió mal' });
  }
};

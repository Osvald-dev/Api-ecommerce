import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import mongoose from "mongoose";
import { UserMongoDao } from '../models/daos/user.mongo.dao.js';


const userController = {};
const userMongoDao = new UserMongoDao();

/**
 * Registra un nuevo usuario
 * @param {Object} req - objeto de solicitud HTTP
 * @param {Object} res - objeto de respuesta HTTP
 */
userController.register = async (req, res) => {
 
   try {
    const { name, email, password } = req.body;
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Falta información en el formulario' });
    }
 
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await userMongoDao.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    const newUser = new User({
        name,
        email,
        password: await bcrypt.hash(password, 10), // Hashear la contraseña antes de guardarla
      });
 
    const createdUser = await userMongoDao.create(newUser);
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: createdUser  });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Ocurrió un error al registrar el usuario' });
  }
}

/**
 * Inicia sesión de un usuario existente
 * @param {Object} req - objeto de solicitud HTTP
 * @param {Object} res - objeto de respuesta HTTP
 */
//login for users or admin
userController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userMongoDao.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'No tiene permiso para acceder a esta función' });
    }
    
    let sessionDuration = process.env.SESSION_DURATION;
    if (user.role === 'admin') {
      sessionDuration = process.env.ADMIN_SESSION_DURATION;
    }
    req.session.userId = user._id;
    req.session.cookie.maxAge = parseInt(sessionDuration);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: sessionDuration });

    req.session.userId = user._id;
    req.session.cookie.maxAge = parseInt(sessionDuration);
    res.status(200).json({ token });
  }
  catch(error){
    console.log(`error de : ${error.message}`);
  }
 }


//only admin
 userController.getUserInfo = async (req, res) => {
  try {
  const userId = req.body;
  const user = await userMongoDao.findById(userId);
  if (!user) {
  return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.status(200).json({ user });
  } catch (error) {
  console.log(error.message);
  res.status(500).json({ message: 'Ocurrió un error al obtener la información del usuario' });
  }
  };
  
  // only admin
  userController.updateUserInfo = async (req, res) => {
  try {
  const userId = req.params;
  const { name, email } = req.body;
  const user = await userMongoDao.findById(userId);
  if (!user) {
  return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  user.name = name || user.name;
  user.email = email || user.email;
  await userMongoDao.update(user);
  res.status(200).json({ message: 'Información de usuario actualizada exitosamente' });
  } catch (error) {
  console.log(error.message);
  res.status(500).json({ message: 'Ocurrió un error al actualizar la información del usuario' });
  }
  };
  
  // users & admin
  userController.changePassword = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { currentPassword, newPassword } = req.body;
      const user = await userMongoDao.findById( new mongoose.Types.ObjectId(userId));
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await userMongoDao.update(user);
      res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Ocurrió un error al cambiar la contraseña del usuario' });
    }
  };
  
 // users & admin
  userController.logout = async (req, res)=> {
    try {
      req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/login');
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
  export default userController;
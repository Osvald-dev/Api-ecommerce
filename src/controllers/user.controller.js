import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import userSchema from '../models/user.js';
import {registerUserService, loginUserService,
getUserInfoService, updateUserService,
changePasswordService, logoutUserService} from '../services/user/user.service.js';
import isAdmin from "../middleware/isAdmin.middleware.js";


/**
 * Registra un nuevo usuario
 * @param {Object} req - objeto de solicitud HTTP
 * @param {Object} res - objeto de respuesta HTTP
 */
const registerController = async (req, res) => {
 
  try {
    const { name, email, password } = req.body;

     const createUser = await registerUserService (name, email, password);
     res.status(201).json({message: 'Usuario registrado exitosamente', user: createUser})
  
  } catch (error) {
    console.log(error.message)
      res.status(500).json({ message: 'Ocurrió un error al registrar el usuario' });
  }
}

/**
 * Inicia sesión de un usuario existente
 * @param {Object} req - objeto de solicitud HTTP
 * @param {Object} res - objeto de respuesta HTTP
 */
//login for users or admin
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const token = await loginUserService(email, password);

    res.cookie("user", token, { maxAge: process.env.SESSION_DURATION * 60 * 1000 });
    res.status(200).json({ token });
  } catch (error) {
    console.log(`error de : ${error.message}`);
    res.status(401).json({ message: error.message });
  }
}

// //only admin
const getUserInfoController = async (req, res) => {
  try {
      const email = req.body.email;
    //  const password = req.body.password;

      isAdmin(req, res, async() =>{
        const user = await getUserInfoService(email);
        res.status(200).json({user})
      })

  }
  catch(error){
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}
 
const updateUserInfoController = async (req, res) =>{
  try {
    const {userId} = req.params;
    const {name, email} = req.body;
    const result = await updateUserService(userId, name, email);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Ocurrió un error al actualizar la información del usuario' });
  }
}
  
//   // users & admin
const changePasswordController = async(req, res) =>{
  try {
    const userId = req.params.userId
    const {currentPassword, newPassword} = req.body;
    const result = await changePasswordService(userId, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Ocurrió un error al cambiar la contraseña del usuario' });
  }
}
//   };
  
//  // users & admin
  const logoutController = async (req, res)=> {
    try {
      const token = req.headers.authorization.split(" ")[1]; // Obtener token del encabezado de autorización
      
      await logoutUserService(token); // Llamar al servicio de logout
  
      req.session.destroy(); // Destruir la sesión del usuario
  
      res.status(200).json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
      console.log(`Error de logout: ${error.message}`);
      res.status(500).json({ message: "Ocurrió un error al cerrar la sesión" });
    }
  }
  export  {registerController, loginController, getUserInfoController, updateUserInfoController, changePasswordController, logoutController};
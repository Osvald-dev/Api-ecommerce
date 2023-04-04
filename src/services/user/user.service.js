import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import  DaosFactory from '../../models/factory.daos.js';


const daosFactory = new DaosFactory();
const UserDao = daosFactory.getDao('user');

const registerUserService = async (name, email, password) =>{
    if(!name || !email || !password){
        throw new Error('Falta información en el formulario');
    }

//verificar si exite el usuario en db
const existingUser = await UserDao.findByEmail(email);
    if(existingUser){
     throw new Error('El usuario ya existe');
}

const hashedPassword = await bcrypt.hash(password, 10);
const newUser = await UserDao.create({ name, email, password: hashedPassword });
await newUser.save();

const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
});

return {
    token,
    user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
    },
};
};

const loginUserService = async (email, password) =>{
    try {
        const User = await UserDao.findByEmail(email);
        if(!User){
            throw new Error ('Email o contraseña incorrectos');
        }
        const isPasswordValid = await bcrypt.compare(password, User.password);
        if(!isPasswordValid){
            throw new Error('Email o contraseña incorrectos')
        }
        let sessionDuration = process.env.SESSION_DURATION;
        if (User.role === 'admin') {
          sessionDuration = process.env.ADMIN_SESSION_DURATION;
        }
        const token = jwt.sign({ _id: User._id }, process.env.JWT_SECRET, { expiresIn: sessionDuration });

        return token;
      } catch (error) {
        throw error;
      }

}

const getUserInfoService = async (email) =>{
    try {
        const user = await UserDao.findByEmail(email);
        if (!user){
            throw new Error ('Usuario no encontrado');
        }
        return user;
    } catch (error) {
        console.log(error.message)
        throw new Error ('Ocurrio un error al obtener la información del usuario');
    }
}

const updateUserService = async (userId, name, email) => {
    try {
        const ObjectId = mongoose.Types.ObjectId;

        const user = await UserDao.findById(userId);
        if(!user){
            return { success: false, message: 'Usuario no encontrado' };
        }

        user.name = name || user.name;
        user.email = email || user.email;
        await UserDao.update(new ObjectId(userId), user);

        return { success: true, message: 'Información de usuario actualizada exitosamente' };
    } catch (error) {
        console.log(error.message);
        return { success: false, message: 'Ocurrió un error al actualizar la información del usuario' };
    }
}

const changePasswordService = async(userId, currentPassword, newPassword)=>{
    try {
        const user = await UserDao.findById(new mongoose.Types.ObjectId(userId));
        if(!user){
            throw new Error ('Usuario no encontrado')
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if(!isPasswordValid){
            throw new Error ('La contraseña actual es incorrecta');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await UserDao.update(user);
        return {message: 'Contraseña actualizada exitosamente'};
    } catch (error) {
        throw new Error (error);
    }
   
}

const logoutUserService = async (userId) =>{
    try {
        const user = await UserDao.findById(userId);
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
        if (user.session.isAuthenticated) {
          user.session.isAuthenticated = false;
          await UserDao.update(user);
        }
        return true;
      } catch (error) {
        throw error;
      }
}

export   {registerUserService, loginUserService, getUserInfoService, updateUserService, changePasswordService, logoutUserService};
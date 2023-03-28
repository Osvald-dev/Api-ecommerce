import jwt from 'jsonwebtoken';
import path from 'path';
import pug from 'pug';
import JWT_CFG from '../config/jwt.config.js';
import ROLE_CFG from '../config/roles.config.js';
import EMAIL_CFG from '../config/email.config.js';
import UserMongoDao from '../models/daos/user/user.mongo.dao.js'
import DaosFactory from '../models/daos/factory.daos.js';
import {mailOptions, transporter} from '../utils/email.utils.js';
import {isDeleteValid, isValidLogin, isValidPassword, isValidRegister} from '../utils/validators/user.utils.js'

import STATUS from '../utils/httpStatus.utils.js';
import { add } from 'date-fns';


const UserDao = DaosFactory.getDaos('user').UserDao

const logoutUserService = async ({ refreshTokenCookie, userCookie }) => {
    try {
      const data = await UserDao.getById(userCookie)
      const isValidLogout = data.refreshToken === refreshTokenCookie
      if (isValidLogout)
        await UserDao.updateById(userCookie, { refreshToken: '' })
      return { isValidLogout }
    } catch (error) {
      throw new Error(      
        'Error occurred on service while trying to logout an user'
        )
    }
  }

  const loginUserService = async (email, password) => {
    try {
      if (!isValidLogin(email, password))
        throw new Error('Missing or invalid: email or password') 
        const data = await UserDao.getByEmail(email)
        console.log(data);
      if (!isValidPassword(password, data.password))
        throw new Error('Missing or invalid: email or password')
        const accessToken = jwt.sign(
        { emailUser: data.email, role: data.isAdmin ? ROLE_CFG.ADMIN : ROLE_CFG.USER },
        JWT_CFG.ACCESS_TOKEN_SECRET,
        { expiresIn: JWT_CFG.EXPIRES_ACCESS_TOKEN }
      )
      const refreshToken = jwt.sign(
        { emailUser: data.email, role: data.isAdmin ? ROLE_CFG.ADMIN : ROLE_CFG.USER },
        JWT_CFG.REFRESH_TOKEN_SECRET,
        { expiresIn: JWT_CFG.EXPIRES_REFRESH_TOKEN }
      )
      await UserDao.updateByEmail(email, { refreshToken })
      return {
                _id: data._id,
                accessToken,
                address: data.address,
                email: data.email,
                logged: true,
                name: data.name,
                //phone: data.phone,
                refreshToken,
                role: data.isAdmin ? ROLE_CFG.ADMIN : ROLE_CFG.USER
      }
    } catch (error) {
      throw new Error(
        'Error occurred on service while trying to login an user'
      )
    }
  }
  const refreshLoginService = async (refreshTokenCookie) => {
    try {
      if (!refreshTokenCookie)
        throw new Error( 'Missing refresh token')
     
      const decoded = await jwt.verify(
        refreshTokenCookie,
        JWT_CFG.REFRESH_TOKEN_SECRET
      )
      const data = await UserDao.getByEmail(decoded.emailUser)
      if (data.refreshToken !== refreshTokenCookie)
        throw new Error( 'Invalid refresh token')
      const accessToken = jwt.sign(
        { emailUser: data.email, role: data.isAdmin ? ROLE_CFG.ADMIN : ROLE_CFG.USER },
        JWT_CFG.ACCESS_TOKEN_SECRET,
        { expiresIn: JWT_CFG.EXPIRES_ACCESS_TOKEN }
      )
      return {
        _id: data._id,
        accessToken,
        address: data.address,
        email: data.email,
        name: data.name,
        phone: data.phone,
        refreshed: true
      }
    } catch (error) {
      throw new Error(        
        'Error occurred on service while trying to login an user'
      )
    }
  }
  /**
 * Register a new user. It saves encrypted password at db.
 *
 * @param {string} address - user's address
 * @param {string} email - user's email
 * @param {string} name - user's name
 * @param {string} password - user's password
 * @param {number} phone - user's phone
 * @return {object} { registered: true }  if register was successful
 */
  const registerUserService = async ({address, email, name, password, phone}) => {
   
    try {
      
      // if (!isValidRegister(address, email, name, password, phone)) //dentro de la validacion se convierten las propiedades en undefined
      //   throw new Error(
      //     `Missing or invalid: address or email or name or password or phone `)
      console.log('aver ahora')
      console.log(name)  
      const user = {address, email, name, password, phone}

      const data = await UserDao.create( user)
      console.log (`Nuevo usuario registrado `)
      
      // const html = pug.renderFile(path.join(__dirname, '../../views/email/newUser.view.pug'), {
      //   email: data.email,
      //   name: data.name
      // })
      // transporter.sendMail(mailOptions(EMAIL_CFG.EMAIL_REPORTS, subject, html),
      //   function (err, info) {
      //     if (err) console.log(err)
      //     else console.log(info)
      //   })
      return {
        _id: data._id,
        address: data.address,
        email: data.email,
        name: data.name,
        phone: data.phone,
        registered: true
      }
    } catch (error) {
      throw new Error(
               error.message )
      
    }
  }
  
  const deleteUserService = async (email) => {
    try {
      if (!isDeleteValid(email))
        throw new Error('Missing or invalid: email')
        await UserDao.deleteByEmail(email)
        return { deleted: true }
    } catch (error) {
      throw new Error('Error occurred on service while trying to delete an user')
    }
  }

  const updateUserService = async (id, address, email, name, password, phone) => {
    try {
      if (!isValidRegister(address, email, name, password, phone))
        throw new Error('Missing or invalid: address or email or name or password or phone')
        await UserDao.updateById(id, { address, email, name, password, phone })
        const data = await UserDao.getById(id)
        return {
            _id: data._id,
            address: data.address,
            email: data.email,
            name: data.name,
            phone: data.phone,
            updated: true
         }
    } catch (error) {
      throw new Error('Error occurred on service while trying to update an user')
    }
  }

  export {  deleteUserService,  loginUserService, logoutUserService,  refreshLoginService, registerUserService, updateUserService
  }
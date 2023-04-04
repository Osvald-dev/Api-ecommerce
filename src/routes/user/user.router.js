import express from 'express';
const router = express.Router();
import {registerController, loginController, getUserInfoController, 
    updateUserInfoController, changePasswordController, logoutController} from '../../controllers/user.controller.js';
import  isAdmin    from '../../middleware/isAdmin.middleware.js';

router.get('/user-info',isAdmin, getUserInfoController); //al probar el end-point es necesario ingresar el password de ADMIN

router.post('/register', registerController);

router.post('/login',loginController);

router.put('/:userId', updateUserInfoController)

router.put('/change-password/:userId', changePasswordController)

router.get('/logout', logoutController);

export default router;
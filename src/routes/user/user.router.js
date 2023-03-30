import express from 'express';
const router = express.Router();
import userController from '../../controllers/user.controller.js';
import  isAdmin    from '../../middleware/isAdmin.middleware.js';

router.get('/user-info',isAdmin, userController.getUserInfo);

router.post('/register', userController.register);

router.post('/login',isAdmin, userController.login);

router.put('/:userId', userController.updateUserInfo)

router.put('/change-password/:userId', userController.changePassword)

router.post('/logout', userController.logout);

export default router;
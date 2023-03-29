import express from 'express';
const router = express.Router();
import userController from '../../controllers/user.controller.js';

router.get('/user-info', userController.getUserInfo);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.put('/:userId', userController.updateUserInfo)

router.put('/change-password/:userId', userController.changePassword)

router.post('/logout', userController.logout);

export default router;
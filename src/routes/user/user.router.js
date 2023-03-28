import express from 'express';
const router = express.Router();
import authController from '../../middleware/authController.js';


router.post('/register', authController.register);


router.post('/login', authController.login);


router.post('/logout', authController.logout);

export default router;
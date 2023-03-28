import { Router } from "express";
import userRoutes from '../routes/user/user.router.js';
import verifyAuth from "../middleware/auth.middleware.js";

const router = Router();

router.use('/user', userRoutes)

export default router;
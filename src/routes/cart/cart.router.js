import express  from 'express';
const router = express.Router();
import cartController from '../../controllers/cart.controller.js'
import authMiddleware from '../../middleware/auth.middleware.js'

// Rutas para el carrito de compras
router.get('/cart', cartController.getCart);

router.post('/cart',authMiddleware, cartController.addToCart);

router.put('/cart/:itemId', cartController.updateCartItem);

router.delete('/cart/:itemId', cartController.removeCartItem);

export default router ;

import express from 'express'
const router = express.Router();
import productController from '../../controllers/product.controller.js'
import logParams from '../../middleware/log.params.js'

// Rutas para obtener la lista de productos
router.get('/products', productController.getProduct);
router.get('/products/:productId',logParams, productController.getProductById);

// Rutas para crear, actualizar y eliminar productos
router.post('/products', productController.createProduct);
router.put('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);
// Ruta para agregar al carrito el producto 
//router.post('/cart', authMiddleware, productController.addToCart);


export default router
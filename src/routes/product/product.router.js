import express from 'express'
const router = express.Router();
import {getAllProductsController, getProductByIdController, getProductsController, 
    deleteProductController, updateProductController, createProductController} from '../../controllers/product.controller.js'
import logParams from '../../middleware/log.params.js'

// Rutas para obtener la lista de productos
router.get('/products', getAllProductsController);
router.get('/products/:productId', getProductByIdController);

// Rutas para crear, actualizar y eliminar productos
router.post('/products', createProductController);
router.put('/products/:productId', updateProductController);
router.delete('/products/:productId', deleteProductController);



export default router
import  express  from 'express';
import {
  addProductToCart,
  createCart,
  deleteCart,
  getAllCart,
  getCart,
  addAllProductsToCart,
  updateShippingCart
} from '../../controllers/cart.controller.js'

const router = express.Router();

router.get('/cart', getAllCart)

router.get('/cart/:id', getCart)

router.post('/cart', createCart)

router.delete('/cart/:id', deleteCart)

router.put('/cart/shipping/:id', updateShippingCart)

router.put('/cart/:id', addProductToCart)

router.post('/cart/products', addAllProductsToCart)

export default router

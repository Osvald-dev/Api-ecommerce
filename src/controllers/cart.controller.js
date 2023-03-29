import CartService from '../services/cart.service.js';
import User from '../models/user.js'
import Product from '../models/products.js'
import Cart from '../models/cart.js'

export default {
    async getCart(req, res, next) {
        try {
          const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
          if (!cart) {
            return res.status(200).json({ message: 'Carrito vacío' });
          }
    
          return res.status(200).json({ items: cart.items });
        } catch (error) {
          return next(error);
        }
      },

      async addToCart(req, res, next) {
        try {
          const { productId, quantity } = req.body;
    
          const product = await Product.findById(productId);
          if (!product) {
            throw new Error('Product not found');
          }
          
          if (product.quantity < quantity) {
            throw new Error('Not enough quantity available');
          }
    
          const user = await User.findById(req.user._id);
          if (!user) {
            throw new Error('User not found');
          }
    
          const cart = user.cart || { items: [] };
          const cartProductIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
          );
          if (cartProductIndex >= 0) {
            cart.items[cartProductIndex].quantity += quantity;
          } else {
            cart.items.push({ product: productId, quantity });
          }
          cart.totalPrice += quantity * product.price;
          cart.totalItems += quantity;
          user.cart = cart;
          await user.save();
    
          res.status(200).json({
            message: 'Product added to cart successfully',
            cart,
          });
        } catch (error) {
          next(error);
        }
      },

      async updateCartItem (req, res, next)  {
        try {
          const { _id: userId } = req.user;
          const { id } = req.params;
          const { quantity } = req.body;
          const updatedCart = await CartService.updateCartItem(userId, id, quantity);
          res.status(200).json(updatedCart);
        } catch (err) {
          next(err);
        }
      },

      async removeCartItem (req, res, next) {
        try {
          const { _id: userId } = req.user;
          const { id } = req.params;
          const updatedCart = await CartService.removeCartItem(userId, id);
          res.status(200).json(updatedCart);
        } catch (err) {
          next(err);
        }
      }
    };
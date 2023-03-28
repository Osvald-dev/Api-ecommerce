import Cart from '../models/cart.js'

export default {
  async getCart(userId) {
    return Cart.findOne({ user: userId }).populate('items.product');
  },

  async addToCart(userId, itemId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      const newCart = new Cart({ user: userId, items: [{ product: itemId, quantity }] });
      return newCart.save();
    }
    const itemIndex = cart.items.findIndex(item => item.product == itemId);
    if (itemIndex === -1) {
      cart.items.push({ product: itemId, quantity });
    } else {
    cart.items[itemIndex].quantity += quantity;
    }
    return cart.save();
    },
    
    async updateCartItem(userId, itemId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    const itemIndex = cart.items.findIndex(item => item.product == itemId);
    cart.items[itemIndex].quantity = quantity;
    return cart.save();
    },
    
    async removeCartItem(userId, itemId) {
    const cart = await Cart.findOne({ user: userId });
    const itemIndex = cart.items.findIndex(item => item.product == itemId);
    cart.items.splice(itemIndex, 1);
    return cart.save();
    }
    };
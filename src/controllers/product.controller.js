import Product from '../models/products.js'
import User from '../models/user.js';

export default {

  async createProduct(req, res, next) {
    try {
        const { name, description, price, quantity } = req.body;
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
        throw new Error('Product already exists');
        }
       
        const product = new Product({
        name,
        description,
        price,
        quantity,
      });
      const result = await product.save();
      res.status(201).json({
        message: 'Product created successfully',
        product: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const { name, description, price, quantity } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          name,
          description,
          price,
          quantity,
        },
        { new: true }
      );
      res.status(200).json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      const { productId } = req.params;
      await Product.findByIdAndDelete(productId);
      res.status(200).json({
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },



  async getProduct(req, res, next) {
    try {
      const products = await Product.find();
      res.status(200).json({
        message: 'Products retrieved successfully',
        products,
      });
    } catch (error) {
      next(error);
    }
  },


  async getProductById (req, res, next){
    try {
        const { productId } = req.params;
        console.log(productId) // retorna undefined
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product });
      } catch (error) {
        next(error);
      }
  }

}

 // En este ejemplo, el controlador addToCart tiene la lógica para agregar un producto al carrito del usuario. Primero, se busca el producto por su ID en la base de datos y se comprueba que haya suficiente cantidad disponible. Luego, se busca al usuario por su ID en la base de datos y se actualiza su carrito de compras con el producto agregado. Finalmente, se envía una respuesta al cliente con el carrito actualizado.
  
  
  
  
  
  
  
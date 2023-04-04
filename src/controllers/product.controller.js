import {getProductById,getAllProducts,deleteProduct,updateProduct,createProduct} from "../services/product/product.service.js";



  const createProductController = async (req, res, next) =>{
    try {
      const result = await createProduct(req.body);

      res.status(201).json({
        message: "Product created successfully",
        product: result,
      });
    } catch (error) {
      next(error);
    }
  }

  const updateProductController = async(req, res, next) => {
    try {
      const { productId } = req.params;
      const {  description,name, price, stock } = req.body;
      const updatedProduct = await updateProduct(
        productId,
        description,
        name,
        price,
        stock
      );
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  const deleteProductController = async(req, res, next) =>{
    try {
      const { productId } = req.params;
      await deleteProduct(productId);
      res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  const getAllProductsController = async(req, res, next) => {
    try {
      const products = await getAllProducts();
      res.status(200).json({
        message: "Products retrieved successfully",
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  const  getProductByIdController = async(req, res, next) => {
    try {
      const { productId } = req.params;
      const product = await getProductById(productId);
      res.status(200).json({ product });
    } catch (error) {
      next(error);
    }
  }

  const getProductsController = async(req, res, next) =>{
    try {
      const products = await getProducts();
      res.status(200).json({
        message: 'Products retrieved successfully',
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  export {getAllProductsController, getProductByIdController, getProductsController, 
    deleteProductController, updateProductController, createProductController}

  
  
  
  
  
  
  
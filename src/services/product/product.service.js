import DaosFactory from "../../models/factory.daos.js";

const daosFactory = new DaosFactory();
const productDao = daosFactory.getDao('product');
//const productService = new ProductService(productDao);

const createProduct = async (product) =>{
  try {
    const result = await productDao.create(product);
    return result;
  } catch (error) {
    throw new Error(`${error.message}  error al crear producto`);
  }
}

const updateProduct = async (productId, name, description, price, quantity) => {
    const updatedProduct = await productDao.updateById(productId, {
      name,
      description,
      price,
      quantity,
    });
    return updatedProduct;
  };

  const deleteProduct= async(productId) => {
    await productDao.deleteById(productId);
  }

  const getAllProducts = async () => {
    const products = await productDao.getAll();
    return products;
  }

  const  getProductById= async(productId) => {
    const product = await productDao.getById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  export {getProductById,getAllProducts,deleteProduct,updateProduct,createProduct}

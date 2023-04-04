import DaosFactory from'../../models/factory.daos.js'
import STATUS from '../../utils/status/httpStatus.utils.js'

import {  isCreateCartValid, isAddProductToCartValid,
  isUpdateShippingCartValid
} from '../../utils/validators/cart.utils.js'


const daosFactory = new DaosFactory();
const CartDao = daosFactory.getDao('cart')
const ProductDao = daosFactory.getDao('product')
const UserDao = daosFactory.getDao('user')

/**
 * Creates a cart.
 *
 * @param {object} { category: string, description:string, name, price, stock }
 * @return {object} {created: true} if creation was successful
 */
export const createCartService = async ({ userId, checkoutEmail }) => {
  try {
    if (!isCreateCartValid({ checkoutEmail, userId }))
      throw new Error('Missing or invalid: checkoutEmail or userId')
    await UserDao.getById(userId)
    const data = await CartDao.create({ checkoutEmail, products: [], user: userId })
    return {
      _id: data._id
    }
  } catch (error) {
    throw new Error(`${error.message} Create Cart service fail`)
  }
}
/**
 * Gets all carts from database.
 *
 * @return {{ carts: Array }} array of carts
 */
export const getAllCartService = async () => {
  try {
    const data = await CartDao.getAll()
    return { carts: data }
  } catch (error) {
    throw new Error(`${error.message} getall Cart service fail`)
  }
}
/**
 * Gets a cart from database by its id.
 *
 * @param {string} id
 * @return {{
 *    _id: data._id,
 *    checkoutEmail: data.checkoutEmail,
 *    products: data.products,
 *    user: data.user
 *   }}
 */
export const getCartService = async (id) => {
  try {
    const data = await CartDao.getById(id)
    return {
      _id: data._id,
      checkoutEmail: data.checkoutEmail,
      pickUp: data.pickUp,
      products: data.products,
      user: data.user
    }
  } catch (error) {
    throw new Error(`${error.message} get Cart service fail`)
  }
}
/**
 * Deletes a cart by its id
 *
 * @param {string} id
 * @return {object} { deleted: true }  if register was successful
 */
export const deleteCartService = async (id) => {
  try {
    await CartDao.deleteById(id)
    return { deleted: true }
  } catch (error) {
    throw new Error(`${error.message} Delete Cart service fail`)
  }
}
/**
 * Add a product to a cart
 *
 * @param {string} id
 * @param {Object} { itemId, quantity }
 * @return {{
 *     _id: string,
 *    checkoutEmail: string,
 *    products: object[],
 *    user: string
 *  }}
 */
export const addProductToCartService = async (id, { productId, quantity }) => {
  try {
    if (!isAddProductToCartValid({ productId, quantity }))
      throw new Error('Missing or invalid: productId or quantity')
    await ProductDao.getById(productId)
    const data = await CartDao.addProductToCart(id, { productId, quantity })
    return {
      _id: data._id,
      checkoutEmail: data.checkoutEmail,
      products: data.products,
      user: data.user
    }

  } catch (error) {
    throw new Error(`${error.message} addProduct to Cart service fail`)
  }
}

/**
 * Add all products to a cart, creates a cart if not exists
 *
 * @param {string} id
 * @param {Array} [{ itemId, quantity }]
 * @return {{
 *     _id: string,
 *    checkoutEmail: string,
 *    products: object[],
 *    user: string
 *  }}
 */
export const addAllProductsToCartService = async (products, userId) => {
  try {
    if (Array.isArray(products) && !products.length)
      throw new Error('Missing or invalid: products')

    if (!userId) // Validar que userId no sea nulo o indefinido
      throw new Error('Missing or invalid: userId')

    const user = await UserDao.getById(userId)
    const data = await CartDao.create({ checkoutEmail: user.name, products, user: userId })
    return {
      _id: data._id,
      checkoutEmail: data.checkoutEmail,
      products: data.products,
      user: data.user
    }
  } catch (error) {
    throw new Error(`${error.message} addAll Cart service fail`)
  }
}

/**
 * Updates shipping info from a cart
 *
 * @param {string} id
 * @param {Object} { itemId, quantity }
 * @return {{
 *     _id: string,
 *    checkoutEmail: string,
 *    products: object[],
 *    user: string
 *  }}
 */
export const updateShippingCartService = async (id, { checkoutEmail, userId, pickUp }) => {
  try {
    if (!isUpdateShippingCartValid({ checkoutEmail, pickUp, userId }))
      throw new Error( 'Missing or invalid: userId. Or Missing or invalid:checkoutEmail and pickUp combination')
    await CartDao.updateById(id, { checkoutEmail, pickUp, user: userId })
    const data = await CartDao.getById(id)
    console.log('🚀 ~ file: cart.service.js ~ line 203 ~ updateShippingCartService ~ data', data)
    return {
      _id: data._id,
      checkoutEmail: data.checkoutEmail,
      pickUp: data.pickUp,
      products: data.products,
      user: data.user
    }
  } catch (error) {
    throw new Error(`${error.message} Update Cart service fail`)
  }
}



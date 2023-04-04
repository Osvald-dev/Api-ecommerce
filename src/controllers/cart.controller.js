import  {apiSuccessResponse} from '../utils/api.utils.js'
import {
  addProductToCartService,
  createCartService,
  deleteCartService,
  getAllCartService,
  getCartService,
  addAllProductsToCartService,
  updateShippingCartService
}from '../services/cart/cart.service.js'

export const createCart = async (req, res, next) => {
  try {
    const { userId,  checkoutEmail } = req.body
    const createMsg = await createCartService({ checkoutEmail, userId })
    const response = apiSuccessResponse(createMsg, STATUS.OK)
    return res.status(STATUS.OK).json(response)
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

export const deleteCart = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleteMsg = await deleteCartService(id)
    const response = apiSuccessResponse(deleteMsg, STATUS.OK)
    return res.status(STATUS.OK).json(response)
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

export const getAllCart = async (req, res, next) => {
  try {
    const getAllMsg = await getAllCartService()
    const response = apiSuccessResponse(getAllMsg, STATUS.OK)
    return res.status(STATUS.OK).json(response)
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

export const getCart = async (req, res, next) => {
  try {
    const { id } = req.params
    const getMsg = await getCartService(id)
    const response = apiSuccessResponse(getMsg, STATUS.OK)
    return res.status(STATUS.OK).json(response)
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

export const addProductToCart = async (req, res, next) => {
  try {
    const { id } = req.params
    const { productId, quantity } = req.body
    const getMsg = await addProductToCartService(id, { productId, quantity }, 'products')
    const response = apiSuccessResponse(getMsg, STATUS.OK)
    return res.status(STATUS.OK).json(response)
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

export const updateShippingCart = async (req, res, next) => {
  try {
    const { id } = req.params
    const { checkoutEmail, pickUp } = req.body
    const userId = req?.cookies?.user
    const getMsg = await updateShippingCartService(id, { checkoutEmail, pickUp, userId })
    const response = apiSuccessResponse(getMsg, STATUS.OK)
    return res.status(STATUS.OK).json(response)
  } catch (error) {
    throw new Error(`${error.message}`)
  }
}

export const addAllProductsToCart = async (req, res, next) => {
  try {
    const { products } = req.body
    const userId = req?.cookies?.user
    console.log(req.cookies) 

    const getMsg = await addAllProductsToCartService(products, userId)
    //const response = apiSuccessResponse(getMsg, STATUS.OK)
    return res.status(STATUS.OK).json(getMsg )
  } catch (error) {
    next(error)
    //throw new Error(`${error.message}`)
  }
}




export const isCreateCartValid = ({ userId, checkoutAddress }) => {
    if (userId === undefined || checkoutAddress === undefined || checkoutAddress === '')
      return false
    const isString = typeof userId === 'string' && typeof checkoutAddress === 'string'
    if (!isString) return false
    return true
  }
  
  export const isUpdateShippingCartValid = ({ userId, checkoutAddress, pickUp }) => {
    if (userId === undefined)
      return false
    if (typeof pickUp !== 'boolean')
      return false
    if (typeof userId !== 'string')
      return false
    if (pickUp === false && !checkoutAddress)
      return false
    if (pickUp === true && checkoutAddress)
      return false
    return true
  }
  
 export const isAddProductToCartValid = ({ productId, quantity }) => {
    if (productId === undefined || quantity === undefined)
      return false
    const isTypeOk = typeof productId === 'string' && typeof +quantity === 'number'
    if (!isTypeOk) return false
    return true
  }


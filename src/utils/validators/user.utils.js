import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { add } from 'date-fns';
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

const salt = () => bcrypt.genSaltSync(10)
const createHash = password => bcrypt.hashSync(password, salt())


export default (() => {
  const UserSchema = new Schema({
    address: { required: true, type: String} ,
    email: { required: true, type: String, unique:true},
    isAdmin: { default: false, type: Boolean },
    name: { required: true, type: String },
    password: { required: true, type: String },
    phone: { required: true, type: Number },
    refreshToken: { type: String }
  }, { timestamps: true })

  

  UserSchema.pre('save', function (next) {
    // 'this' refers to a document
    this.password = createHash(this.password)
    console.log(this.password)
    next()
  })

  UserSchema.pre('updateOne', function (next) {
    if (this._update.$set.password !== undefined)
      this._update.$set.password = createHash(this._update.$set.password)
    next()
  })

  return {
    UserSchema
  }
})()

const isDeleteValid= (email) => {
    return emailRegex.test(email);
} 


 const isValidLogin = (email, password) => {
  const isEmailValid = emailRegex.test(email)
  if (!isEmailValid || password === undefined || !password?.length)
    return false
  return true
}

/**
 * 
 * @param {string} address 
 * @param {string} email 
 * @param {string} name 
 * @param {string} password 
 * @param {number} phone 
 * @returns {boolean}  true si el registro es válido, false si no es válido
 */

const isValidRegister = (address, email, name, password, phone) => {
      const isEmailValid = emailRegex.test(email)
      if (
        address === undefined || !address?.length ||
        !isEmailValid ||
        name === undefined || !name?.length ||
        password === undefined || !password?.length ||
        Number.isNaN(Number(phone))
      ) return false
      return true
    }

const isValidPassword = (password, encriptedPassword) => {
  try {
    return bcrypt.compareSync(password, encriptedPassword);
  } catch (error) {
    console.log(`Error al comparar las contraseñas`) }
  }

export  {isDeleteValid ,isValidLogin,isValidPassword,isValidRegister}
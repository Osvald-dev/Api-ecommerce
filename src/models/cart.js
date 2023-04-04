import mongoose from 'mongoose';

const { Schema } = mongoose;

const CartSchema = new Schema({
    checkoutEmail: { type: String },
     pickUp: { type: Boolean },
     products: [{
      _id: { ref: 'products', required: true, type: Schema.Types.ObjectId },
      quantity: { required: true, type: Number }
   }],
     user: { ref: 'users', required: true, type: Schema.Types.ObjectId }
}, { timestamps: true })



export default CartSchema;

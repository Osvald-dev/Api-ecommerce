import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: { required: true, type: Array },
  description: { required: true, type: String },
  name: { required: true, type: String },
  //photo: { required: true, type: String },
  price: { required: true, type: Number },
  stock: { required: true, type: Number }
}, { timestamps: true })

// Agregar métodos a ProductSchema
ProductSchema.statics = {
  findProductById: function (id, callback) {
    return this.findOne({ _id: id }, callback);
  },
  findProductByName: function (name, callback) {
    return this.findOne({ name: name }, callback);
  }
};

export default ProductSchema
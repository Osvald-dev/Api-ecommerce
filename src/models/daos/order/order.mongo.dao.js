import  {Schema} from "mongoose";
import MongoContainer from "../../containers/mongo.container.js";

const OrderSchema = new Schema({
    cartId: { required: true, type: String, unique: true },
    checkoutAddress: { required: true, type: String },
    orderNumber: { required: true, type: Number },
    products: [
      {
        description: { required: true, type: String },
        name: { required: true, type: String },
        photo: { required: true, type: String },
        price: { required: true, type: Number },
        quantity: { required: true, type: Number }
      }],
    status: { default: 'Generated', required: true, type: String },
    user: { ref: 'users', required: true, type: Schema.Types.ObjectId }
  
  }, { timestamps: true })

class MongoOrderDao extends MongoContainer {
    constructor () {
      super('orders', OrderSchema)
    }
  
async create(payload) {
    try {
      const lastDocument = await this.Model.findOne({}, { __v: 0 })
        .sort({ orderNumber: -1 })
        .lean();
      const orderNumber = lastDocument ? lastDocument.orderNumber + 1 : 1;
      const newDocument = new this.Model({ ...payload, orderNumber });
      const newDocumentSaved = await newDocument.save();
      return newDocumentSaved;
    } catch (error) {
      const { password, ...cleanedPayload } = payload;
      throw new CustomError(
        error.code || STATUS.BAD_REQUEST,
        `Error occurred while trying to save document: ${JSON.stringify(cleanedPayload)}`,
        error.message
      );
    }
  }
  
}
  
  
  export default MongoOrderDao;
  
  
  
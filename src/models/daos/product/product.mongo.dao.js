import { Schema } from "mongoose";
import MongoContainer from "../../containers/mongo.container.js";
import ProductSchema from '../../products.js'


class MongoProductDao extends MongoContainer {
    constructor () {
      super('products', ProductSchema)
    }
  
    getByCategory = async (queryCategory) => {
      
      try {
        const documents = await this.Model.find({ category: { $in: [queryCategory] } })
        return documents
      } catch (error) {
        throw new Error(`Error occurred while trying to get a documents by category: ${error.message}`)
      }
    }
  }

export default MongoProductDao;
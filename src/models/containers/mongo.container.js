import mongoose from "mongoose";
import DB_CFG from "../../config/db.config.js";

const  {MONGO_URI } = DB_CFG.MONGO.URI;

class MongoContainer {
    static #collectionInstances = {};
  
    static async setupConnection() {
      try {
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error(error);
        throw new Error(`Error occurred while trying to setup a connection to the database: ${error.message}`);
      }
    }
  
    constructor(collection, schema) {
      if (!MongoContainer.#collectionInstances[collection]) {
        this.collection = collection;
        this.Model = mongoose.model(collection, schema);
        MongoContainer.#collectionInstances[collection] = this;
      }
  
      return MongoContainer.#collectionInstances[collection];
    }
  


    async isValidId(id) {
		return mongoose.isValidObjectId(id);
	}

    async getAll (){
        try {
            const documents = await this.Model.find({}).lean();
            return documents;
        } catch (error) {
            throw new Error (`${error.message} Error while trying to get all documents from db`)
        }
    }

    async getById(id) {
       
        try {
            if (!id || !mongoose.isValidObjectId(id)) {
                throw new Error(`MongoDB's ${id} is not a valid ObjectId`);
            }
    
            const { __v, ...doc } = await this.Model
                .findOne({ _id: id })
                .lean();
    
            if (!doc) {
                throw new Error(`MongoDB document with id: ${id} could not be found!`);
            }
    
            return doc;
        } catch (error) {
            throw error;
        }
    }
    
    async getBy(key, value) {
        try {
          const document = await this.Model.findOne({ [key]: value }, { __v: 0 });
          if (!document) {
            throw new Error( `MongoDB document with key, value: ${key}, ${value} could not be found!`)
          }              
          return document;
        } catch (error) {
          throw new Error(`Error occurred while trying to get a document with key, value: ${key}, ${value}`);
        }
      }

    async create(payload) {
        if (!payload || typeof payload !== "object") {
          throw new Error("Invalid payload parameter: expected an object");
        }
      
        try {
          const newDocuments = await this.Model.create(payload);
          return newDocuments;
        } catch (error) {
          const { password, ...cleanedPayload } = payload;
      
          if (error.code === 11000) {
           
            throw new Error(`A document with the key '${Object.keys(error.keyValue)}' already exists` );
          }
      
          throw new Error(`Error occurred while trying to save document: ${JSON.stringify(cleanedPayload)}`);
        }
      }
      
      async updateById(id, payload) {
        try {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`${error.message} MongoDB's id is not a valid ObjectId`);
          }
      
          const updateDocument = await this.Model.findOneAndUpdate(
            { _id: id },
            { ...payload },
            { new: true }
          );
      
          if (!updateDocument) {
            throw new Error(
              `${error.message} : MongoDB's document with id: ${id} could not be found!`
            );
          }
      
          return updateDocument;
        } catch (error) {
          throw new Error(
            `${error.message} Error occurred while trying to update document with id: ${id}`
          );
        }
      }
      

    async deleteById (id){
        try {
            if(!mongoose.isValidObjectId(id))
            throw new Error (`${error.message} MongoDB's ${id} is not a valid ObjectId`)

            const deleteDocument = await this.Model.deleteOne({_id: id})
            if(!deleteDocument.deletedCount)
            throw new Error (`${error.message} `)

            return deleteDocument;
        } catch (error) {
            throw new Error (`${error.message} `)
        }
    }
   
}
(async () => {
    await MongoContainer.setupConnection();
  })();

export default MongoContainer;


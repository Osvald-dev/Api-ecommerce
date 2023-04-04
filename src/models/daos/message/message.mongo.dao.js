import MongoContainer from "../../containers/mongo.container.js";
import MessageSchema from "../../message.js";

class MongoMessageDao extends MongoContainer {
    constructor () {
      super('messages', MessageSchema)
    }
  }

  export default MongoMessageDao;
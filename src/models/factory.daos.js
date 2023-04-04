import MongoCartDao from './daos/cart/cart.mongo.dao.js'
import MongoMessageDao from './daos/message/message.mongo.dao.js'
import MongoOrderDao from './daos/order/order.mongo.dao.js'
import MongoProductDao from './daos/product/product.mongo.dao.js'
import MongoUserDao from './daos/user/user.mongo.dao.js'

class DaosFactory {
    constructor() {
      this.daoMap = new Map([
        ['cart', new MongoCartDao()],
        ['message', new MongoMessageDao()],
        ['order', new MongoOrderDao()],
        ['product', new MongoProductDao()],
        ['user', new MongoUserDao()]
      ]);
    }
  
    getDao(type) {
      const dao = this.daoMap.get(type.toLowerCase());
      if (!dao) {
        throw new Error(`Invalid data source, please provide one of the following 
        < cart | message | order | product | user >. Not ${type}`);
      }
      return dao;
    }
  }

  export default DaosFactory;

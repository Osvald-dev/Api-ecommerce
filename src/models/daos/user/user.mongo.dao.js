import userSchema from '../../user.js'
import MongoContainer from '../../containers/mongo.container.js';
import mongoose from 'mongoose';



class MongoUserDao extends MongoContainer {
    constructor() {
      super('users', userSchema)
  }


    async findById(id) {
      try {
        const user = await this.Model.findById(id);
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    async findByEmail(email) {
    try {
      const user = await this.Model.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

    // async create(user) {
    //   try {
    //     const newUser = new User(user);
    //     await newUser.save();
    //     return newUser;
    //   } catch (error) {
    //     throw error;
    //   }
    // }
  
    // Método para actualizar un usuario existente
    async update(id, updateData) {
      try {
        const user = await this.Model.findByIdAndUpdate(id, updateData, { new: true });
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    async delete(userId) {
      try {
        await this.Model.findByIdAndDelete(userId);
      } catch (error) {
        throw error;
      }
    }
  }
  
 export default  MongoUserDao
import User from '../user.js'

class UserMongoDao {
    async findById(id) {
      try {
        const user = await User.findById(id);
        return user;
      } catch (error) {
        throw error;
      }
    }
  
     async findByEmail(email) {
      try {
        const user = await User.findOne({ email });
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    async create(user) {
      try {
        const newUser = new User(user);
        await newUser.save();
        return newUser;
      } catch (error) {
        throw error;
      }
    }
  
    // Método para actualizar un usuario existente
    async update(id, updateData) {
      try {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    async delete(userId) {
      try {
        await User.findByIdAndDelete(userId);
      } catch (error) {
        throw error;
      }
    }
  }
  
 export { UserMongoDao}
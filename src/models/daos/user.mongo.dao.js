import User from '../models/user.js'


class UserMongoDao {
    // Método para buscar un usuario por su ID
    async findById(userId) {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    // Método para buscar un usuario por su correo electrónico
     async findByEmail(email) {
      try {
        const user = await User.findOne({ email });
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    // Método para crear un nuevo usuario
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
    async update(userId, updateData) {
      try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        return user;
      } catch (error) {
        throw error;
      }
    }
  
    // Método para eliminar un usuario existente
    async delete(userId) {
      try {
        await User.findByIdAndDelete(userId);
      } catch (error) {
        throw error;
      }
    }
  }
  
 export { UserMongoDao}
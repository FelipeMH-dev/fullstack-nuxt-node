const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

class UserRepository {
  async createUser(userEntity) {
    const user = new UserModel(userEntity);
    return user.save();
  }

  async findByUsername(username) {
    return UserModel.findOne({ username });
  }

  async findById(id) {
    return UserModel.findById(id);
  }

  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async comparePassword(password, plainPassword) {
    
    return bcrypt.compare(plainPassword, password);
  }
}

module.exports = UserRepository;

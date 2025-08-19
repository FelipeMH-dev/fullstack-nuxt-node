const UserValidator = require("../../interfaces/validators/user.validator");
const RegisterDTO = require("../../interfaces/dto/register.dto");
const UserRepository = require("../../infrastructure/db/repositories/user.repository");
const bcrypt = require("bcrypt");

class RegisterUserUseCase {
  constructor() {
    this.userRepo = new UserRepository();
    this.SALT_ROUNDS = 10; // Para bcrypt
  }

  /**
   * Ejecuta el registro de un usuario
   * @param {Object} userData - { username, email, password }
   */
  async execute(userData) {
    const dto = new RegisterDTO(userData);

    UserValidator.validateRegister(dto);

    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    const existingUsername = await this.userRepo.findByUsername(dto.username);
    if (existingUsername) throw new Error("El username ya está registrado");

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    dto.password = hashedPassword;

    const newUser = await this.userRepo.createUser(dto);

    return {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };
  }
}

module.exports = RegisterUserUseCase;

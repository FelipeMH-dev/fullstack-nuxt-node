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
    // 1️⃣ Crear DTO
    const dto = new RegisterDTO(userData);

    // 2️⃣ Validar DTO
    UserValidator.validateRegister(dto);

    // 3️⃣ Verificar que el email no exista
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // 4️⃣ Hashear la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    dto.password = hashedPassword;

    // 5️⃣ Guardar usuario en repositorio
    const newUser = await this.userRepo.createUser(dto);

    // 6️⃣ Devolver información mínima del usuario (sin contraseña)
    return {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email
    };
  }
}

module.exports = RegisterUserUseCase;

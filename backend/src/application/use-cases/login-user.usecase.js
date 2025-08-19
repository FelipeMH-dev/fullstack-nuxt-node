const UserValidator = require("../../interfaces/validators/user.validator");
const LoginDTO = require("../../interfaces/dto/login.dto");
const UserRepository = require("../../infrastructure/db/repositories/user.repository");
const jwt = require("jsonwebtoken");

class LoginUserUseCase {
  constructor() {
    this.userRepo = new UserRepository();
    this.JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
  }

  /**
   * Ejecuta el login de un usuario
   * @param {Object} loginData - { email, password }
   */
  async execute(loginData) {
    // 1️⃣ Crear DTO
    const dto = new LoginDTO(loginData);

    // 2️⃣ Validar DTO
    UserValidator.validateLogin(dto);

    // 3️⃣ Buscar usuario por email
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new Error("Email o contraseña incorrectos");
    }

    // 4️⃣ Validar contraseña
    const isValid = await this.userRepo.comparePassword(user.password, dto.password);
    if (!isValid) {
      throw new Error("Email o contraseña incorrectos");
    }

    // 5️⃣ Generar token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6️⃣ Devolver información mínima + token
    return {
      id: user._id,
      usernamename: user.username,
      email: user.email,
      token
    };
  }
}

module.exports = LoginUserUseCase;

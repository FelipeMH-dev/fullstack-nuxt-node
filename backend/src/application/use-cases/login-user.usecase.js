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
    const dto = new LoginDTO(loginData);
    UserValidator.validateLogin(dto);

    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new Error("Email o contraseña incorrectos");
    }

    const isValid = await this.userRepo.comparePassword(
      user.password,
      dto.password
    );
    if (!isValid) {
      throw new Error("Email o contraseña incorrectos");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      id: user._id,
      usernamename: user.username,
      email: user.email,
      token,
    };
  }
}

module.exports = LoginUserUseCase;

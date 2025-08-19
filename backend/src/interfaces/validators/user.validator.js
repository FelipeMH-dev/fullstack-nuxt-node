class UserValidator {
  static validateRegister(dto) {
    if (!dto.username || !dto.email || !dto.password) {
      throw new Error("Todos los campos son obligatorios");
    }
    // Validación simple de email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(dto.email)) {
      throw new Error("Email inválido");
    }
    if (dto.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }
  }

  static validateLogin(dto) {
    if (!dto.email || !dto.password) {
      throw new Error("Email y contraseña son obligatorios");
    }
  }
}

module.exports = UserValidator;

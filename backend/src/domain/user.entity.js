class User {
  constructor({ id, username, password, email }) {
    if (!username) throw new Error("Username es obligatorio");
    if (!password) throw new Error("PasswordHash es obligatorio");
    if (!email) throw new Error("Email es obligatorio");
    
    this.id = id;                  // ID único del usuario
    this.username = username;      // Nombre de usuario
    this.password = password; // Password encriptado
    this.email = email;          // Email del usuario
  }
}

module.exports = User;

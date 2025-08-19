class LoginDTO {
  constructor({ email, password }) {
    if (!email || !password) throw new Error("email & password required");
    this.email = email;
    this.password = password;
  }
}
module.exports = LoginDTO;
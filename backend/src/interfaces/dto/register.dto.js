class RegisterDTO {
  constructor({ username, password, email }) {
    if (!username || !password  || !email) throw new Error("username & password required");
    this.username = username;
    this.password = password;
    this.email = email;
  }
}
module.exports = RegisterDTO;
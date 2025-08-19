const jwt = require("jsonwebtoken");
const UserRepository = require("../db/repositories/user.repository");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

async function authMiddleware(headers = {}) {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader) throw new Error("No se proporcionó token");

  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userRepo = new UserRepository();
    const user = await userRepo.findById(payload.id);
    if (!user) throw new Error("Usuario no encontrado");
    return { id: user._id, username: user.username, token };
  } catch (err) {
    throw new Error("Token inválido");
  }
}

module.exports = authMiddleware;

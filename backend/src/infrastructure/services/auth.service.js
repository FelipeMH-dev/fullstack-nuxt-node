const { Service } = require("moleculer");
const RegisterUserUseCase = require("../../application/use-cases/register-user.usecase");
const LoginUserUseCase = require("../../application/use-cases/login-user.usecase");

module.exports = {
  name: "auth",
  actions: {
    register: {
      rest: { method: "POST", path: "/register" },
      params: { username: "string", password: "string", email: "string" },
      async handler(ctx) {
        console.log("[Auth.service] Registration attempt:", {
          username: ctx.params.username,
          email: ctx.params.email,
        });

        try {
          const useCase = new RegisterUserUseCase();
          const user = await useCase.execute(ctx.params);

          console.log("[Auth.service] User registered successfully:", {
            id: user._id,
            username: user.username,
            email: user.email,
          });

          return user;
        } catch (error) {
          console.error("[Auth.service] Registration failed:", error);
          throw error;
        }
      }
    },

    login: {
      rest: { method: "POST", path: "/login" },
      params: { email: "string", password: "string" },
      async handler(ctx) {
        console.log("🔐 [Auth.service] Login attempt:", { email: ctx.params.email });

        try {
          const useCase = new LoginUserUseCase();
          const result = await useCase.execute(ctx.params);

          console.log("[Auth.service] Login successful:", {
            email: ctx.params.email,
            token: result.token ? "Token generated ✔️" : "No token",
          });

          return result;
        } catch (error) {
          console.error("[Auth.service] Login failed:", error);
          throw error;
        }
      }
    }
  }
};

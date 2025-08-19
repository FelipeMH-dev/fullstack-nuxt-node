const { Service } = require("moleculer");
const RegisterUserUseCase = require("../../application/use-cases/register-user.usecase");
const LoginUserUseCase = require("../../application/use-cases/login-user.usecase");

module.exports = {
  name: "auth",
  actions: {
    register: {
      rest: { method: "POST", path: "/register" },
      params: { username: "string", password: "string" },
      async handler(ctx) {
        const useCase = new RegisterUserUseCase();
        const user = await useCase.execute(ctx.params);
        return user;
      }
    },
    login: {
      rest: { method: "POST", path: "/login" },
      params: { email: "string", password: "string" },
      async handler(ctx) {
        const useCase = new LoginUserUseCase();
        return useCase.execute(ctx.params);
      }
    }
  }
};

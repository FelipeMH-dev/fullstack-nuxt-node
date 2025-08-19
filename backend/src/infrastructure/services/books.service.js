const { Service } = require("moleculer");
const SearchBooksUseCase = require("../../application/use-cases/search-books.usecase");
const AddBookUseCase = require("../../application/use-cases/add-book.usecase");
const UpdateBookUseCase = require("../../application/use-cases/update-book.usecase");
const DeleteBookUseCase = require("../../application/use-cases/delete-book.usecase");
const GetBookUseCase = require("../../application/use-cases/get-book.usecase");
const ListLibraryUseCase = require("../../application/use-cases/list-library.usecase");
const FindCoverUseCase = require("../../application/use-cases/find-cover.usercase");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = {
  name: "books",
  actions: {
    search: {
      rest: { method: "GET", path: "/search" },
      params: { q: "string" },
      async handler(ctx) {
        const user = await authMiddleware(ctx.meta.headers);
        const useCase = new SearchBooksUseCase(this.broker);
        return useCase.execute(user.id, ctx.params.q, user.token);
      }
    },
   add: {
      rest: { method: "POST", path: "/my-library" },
      async handler(ctx) {
        const user = await authMiddleware(ctx.meta.headers);
        const useCase = new AddBookUseCase();
        const data = { ...ctx.params, userId: user.id };
        const book = await useCase.execute(data);
        return { message: "Libro guardado con éxito", book };
      }
    },
   update: {
      rest: { method: "PUT", path: "/my-library/:id" },
      async handler(ctx) {
        await authMiddleware(ctx.meta.headers);
        const useCase = new UpdateBookUseCase();
        const updated = await useCase.execute(ctx.params.id, ctx.params);
        return { message: "Libro actualizado", book: updated };
      }
    },
    delete: {
      rest: { method: "DELETE", path: "/my-library/:id" },
      async handler(ctx) {
        await authMiddleware(ctx.meta.headers);
        const useCase = new DeleteBookUseCase();
        await useCase.execute(ctx.params.id);
        return { message: "Libro eliminado" };
      }
    },
   find: {
      rest: { method: "GET", path: "/my-library/:id" },
      async handler(ctx) {
        await authMiddleware(ctx.meta.headers);
        const useCase = new GetBookUseCase();
        return useCase.execute(ctx.params.id);
      }
    },
     list: {
      rest: { method: "GET",  path: "/my-library" },
      async handler(ctx) {
        const user = await authMiddleware(ctx.meta.headers);
        const useCase = new ListLibraryUseCase();
        return useCase.execute(user.id);
      }
    },
      getFrontCover: {
      rest: { method: "GET", path: "/library/front-cover/:id" },
      async handler(ctx) {
        const { id } = ctx.params; 
        await authMiddleware(ctx.meta.headers);
        const useCase = new FindCoverUseCase();
        return useCase.execute(id)
      }
    }
  }
};

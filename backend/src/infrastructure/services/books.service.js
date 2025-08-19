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
        console.log("[Books.service] search called with query:", ctx.params.q);
        const user = await authMiddleware(ctx.meta.headers);
        console.log("[Books.service] authenticated user:", user.id);
        const useCase = new SearchBooksUseCase(this.broker);
        const results = await useCase.execute(user.id, ctx.params.q, user.token);
        console.log("[Books.service] search results count:", results.length);
        return results;
      }
    },

    add: {
      rest: { method: "POST", path: "/my-library" },
      async handler(ctx) {
        console.log("[Books.service] add called with data:", ctx.params);
        const user = await authMiddleware(ctx.meta.headers);
        console.log("[Books.service] authenticated user:", user.id);
        const useCase = new AddBookUseCase();
        const data = { ...ctx.params, userId: user.id };
        const book = await useCase.execute(data);
        console.log("[Books.service] book added with id:", book.id);
        return { message: "Libro guardado con éxito", book };
      }
    },

    update: {
      rest: { method: "PUT", path: "/my-library/:id" },
      async handler(ctx) {
        console.log("[Books.service] update called for id:", ctx.params.id);
        await authMiddleware(ctx.meta.headers);
        const useCase = new UpdateBookUseCase();
        const updated = await useCase.execute(ctx.params.id, ctx.params);
        console.log("[Books.service] book updated:", updated.id);
        return { message: "Libro actualizado", book: updated };
      }
    },

    delete: {
      rest: { method: "DELETE", path: "/my-library/:id" },
      async handler(ctx) {
        console.log("[Books.service] delete called for id:", ctx.params.id);
        await authMiddleware(ctx.meta.headers);
        const useCase = new DeleteBookUseCase();
        await useCase.execute(ctx.params.id);
        console.log("[Books.service] book deleted:", ctx.params.id);
        return { message: "Libro eliminado" };
      }
    },

    find: {
      rest: { method: "GET", path: "/my-library/:id" },
      async handler(ctx) {
        console.log("[Books.service] find called for id:", ctx.params.id);
        await authMiddleware(ctx.meta.headers);
        const useCase = new GetBookUseCase();
        const book = await useCase.execute(ctx.params.id);
        console.log("[Books.service] book found:", book.id);
        return book;
      }
    },

    list: {
      rest: { method: "GET", path: "/my-library" },
      async handler(ctx) {
        console.log("[Books.service] list called");
        const user = await authMiddleware(ctx.meta.headers);
        console.log("[Books.service] authenticated user:", user.id);
        const useCase = new ListLibraryUseCase();
        const books = await useCase.execute(user.id);
        console.log("[Books.service] number of books in library:", books.length);
        return books;
      }
    },

    getFrontCover: {
      rest: { method: "GET", path: "/library/front-cover/:id" },
      async handler(ctx) {
        const { id } = ctx.params;
        console.log("[Books.service] getFrontCover called for id:", id);
        await authMiddleware(ctx.meta.headers);
        const useCase = new FindCoverUseCase();
        const cover = await useCase.execute(id);
        console.log("[Books.service] cover retrieved for book id:", id);
        return cover;
      }
    }
  }
};

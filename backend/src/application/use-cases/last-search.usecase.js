const LastSearchRepository = require("../../infrastructure/db/repositories/last-search.repository");

class LastSearchUseCase {
  constructor() {
    this.lastSearchRepo = new LastSearchRepository();
  }

  async execute(userId) {
    if (!userId) {
      throw new Error("UserId is required");
    }
    return this.lastSearchRepo.getLastSearches(userId,5);
  }
}

module.exports = LastSearchUseCase;

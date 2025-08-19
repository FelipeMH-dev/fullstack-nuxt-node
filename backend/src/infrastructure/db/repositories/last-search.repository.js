const LastSearchModel = require("../models/last-search.model");
const mongoose = require("mongoose");

class LastSearchRepository {
  async addSearch(userId, query) {
    const search = new LastSearchModel({ userId, query });
    await search.save();

    // Mantener solo las últimas 5 búsquedas
    const count = await LastSearchModel.countDocuments({ userId });
    if (count > 5) {
      const oldest = await LastSearchModel.find({ userId })
        .sort({ createdAt: 1 })
        .limit(count - 5);
      const idsToDelete = oldest.map((s) => s._id);
      await LastSearchModel.deleteMany({ _id: { $in: idsToDelete } });
    }
  }

  async getLastSearches(userId, limit = 5) {
    const searches = await LastSearchModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$query", latest: { $first: "$createdAt" } } },
      { $sort: { latest: -1 } },
      { $limit: limit },
      { $project: { _id: 0, query: "$_id" } },
    ]);

    return searches.map((s) => s.query);
  }
}

module.exports = LastSearchRepository;

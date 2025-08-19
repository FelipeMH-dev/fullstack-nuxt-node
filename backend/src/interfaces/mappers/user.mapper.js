module.exports = {
  toResponse(userDoc) {
    return { id: userDoc._id?.toString?.(), username: userDoc.username };
  }
};
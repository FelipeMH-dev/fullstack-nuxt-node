const FRONT_COVER_BASE_PATH = "/api/books/library/front-cover";
function buildFrontCoverUrl(bookId) { return bookId ? `${FRONT_COVER_BASE_PATH}/${bookId}` : null; }

module.exports = {
  toDomain(dto) {
    return {
      title: dto.title,
      author: dto.author ?? "Unknown",
      year: dto.year ?? null,
      coverBase64: dto.coverBase64 ?? null,
      review: dto.review ?? null,
      rating: dto.rating ?? null,
      userId: dto.userId ?? null
    };
  },
  toResponse(entityOrDoc) {
    if (!entityOrDoc) return null;
    const id = entityOrDoc._id?.toString?.() || entityOrDoc.id || null;
    return {
      id,
      title: entityOrDoc.title,
      author: entityOrDoc.author,
      year: entityOrDoc.year,
      review: entityOrDoc.review ?? null,
      rating: entityOrDoc.rating ?? null,
      coverBase64: entityOrDoc.coverBase64 ?? null,
    };
  },
  fromOpenLibraryToSearchResult(openLibDoc, opts = {}) {
    const title = openLibDoc?.title || "Untitled";
    const author = Array.isArray(openLibDoc?.author_name)
      ? openLibDoc.author_name[0]
      : (openLibDoc?.author_name || "Unknown");
    const year = openLibDoc?.first_publish_year || null;
    const coverId = openLibDoc?.cover_i || null;

    const key = `${title}|${author}|${year}`;
    const local = opts.existingByKey?.get?.(key);

    let cover = null;
    if (local?._id) {
      cover = { type: "library", url: buildFrontCoverUrl(local._id.toString()) };
    } else if (coverId) {
      cover = { type: "openlibrary", url: `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` };
    }
    return { title, author, year, cover };
  },
  utils: { buildFrontCoverUrl }
};
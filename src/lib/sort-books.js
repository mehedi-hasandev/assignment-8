function getBookTimestamp(book) {
  const createdAt = Date.parse(book.createdAt);
  if (Number.isFinite(createdAt)) return createdAt;

  const id = book._id?.$oid ?? book._id ?? book.id ?? book.bookId;
  const match = typeof id === "string" ? id.match(/^[a-f\d]{8}/i) : null;

  return match ? Number.parseInt(match[0], 16) * 1000 : 0;
}

export function sortBooksNewestFirst(books) {
  return [...books].sort((a, b) => {
    const timeDifference = getBookTimestamp(b) - getBookTimestamp(a);
    if (timeDifference !== 0) return timeDifference;

    const aId = String(a._id?.$oid ?? a._id ?? a.id ?? a.bookId ?? "");
    const bId = String(b._id?.$oid ?? b._id ?? b.id ?? b.bookId ?? "");
    return bId.localeCompare(aId);
  });
}

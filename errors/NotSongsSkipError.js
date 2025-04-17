class NotSongsSkipError extends Error {
  constructor(message = "❌ No hay más canciones para saltar.") {
    super(message);
    this.name = "NotSongsSkipError";
  }
}

module.exports = NotSongsSkipError;

class NotSongsPlayingError extends Error {
  constructor(message = "❌ No hay nada reproduciéndose.") {
    super(message);
    this.name = "NotSongsPlayingError";
  }
}

module.exports = NotSongsPlayingError;

class SkipSongError extends Error {
    constructor(message = "❌ Ocurrió un error al saltar la canción.") {
      super(message);
      this.name = "SkipSongError";
    }
  }
  
  module.exports = SkipSongError;
  
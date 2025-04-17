class SongNotFoundError extends Error {
    constructor(
      message = "❌ No se encontró ninguna coincidencia.",
    ) {
      super(message);
      this.name = "SongNotFoundError";
    }
  }
  
  module.exports = SongNotFoundError;
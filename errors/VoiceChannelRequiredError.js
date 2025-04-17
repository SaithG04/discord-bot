class VoiceChannelRequiredError extends Error {
  constructor(
    message = "❌ Debes estar en un canal de voz para usar este comando.",
  ) {
    super(message);
    this.name = "VoiceChannelRequiredError";
  }
}

module.exports = VoiceChannelRequiredError;
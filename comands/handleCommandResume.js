const { AudioPlayerStatus } = require("@discordjs/voice");
const logger = require("../logger");
const { getQueue } = require("../queue");

/**
 * Verifica si hay una cola de reproducción activa.
 */
const checkServerQueue = (guildId) => {
  const serverQueue = getQueue(guildId);
  if (!serverQueue) {
    logger.error(`❌ No hay nada en la cola en el servidor con ID: ${guildId}`);
    throw new Error("❌ No hay nada que reanudar.");
  }

  return serverQueue;
};

/**
 * Verifica si la música está pausada.
 */
const checkIfPaused = (serverQueue) => {
  if (serverQueue.player.state.status !== AudioPlayerStatus.Paused) {
    logger.error(`❌ La música no está pausada en el servidor con ID: ${serverQueue.guildId}`);
    throw new Error("❌ La música no está en pausa.");
  }
};

/**
 * Reanuda la reproducción de la música.
 */
const resumeMusic = (serverQueue) => {
  try {
    serverQueue.player.unpause();
    logger.info(`✅ Reproducción reanudada en el servidor con ID: ${serverQueue.guildId}`);
  } catch (error) {
    logger.error(`❌ Error al reanudar la música en el servidor con ID: ${serverQueue.guildId}: ${error.message}`);
    throw new Error("❌ Ocurrió un error al reanudar la reproducción.");
  }
};

/**
 * Manejador principal del comando /resume.
 */
const handleCommandResume = async (interaction) => {
  logger.info(`Comando /resume ejecutado por: ${interaction.user.tag}`);
  const guildId = interaction.guild.id;

  try {
    const serverQueue = checkServerQueue(guildId);
    checkIfPaused(serverQueue);
    resumeMusic(serverQueue);

    return interaction.reply({
      content: "▶️ Reproducción reanudada.",
      flags: 64,
    });
  } catch (error) {
    logger.error(`❌ Error en el comando /resume: ${error.message}`);
    return interaction.reply({
      content: error.message,
      flags: 64,
    });
  }
};

module.exports = { handleCommandResume };
const { AudioPlayerStatus } = require("@discordjs/voice");
const logger = require("../logger");
const queue = require("../queue");

/**
 * Verifica si hay una cola de reproducción activa.
 */
const checkServerQueue = (guildId) => {
  if (!guildId) {
    logger.error("❌ El ID de servidor no es válido.");
    throw new Error("❌ El ID de servidor no es válido.");
  }

  const serverQueue = queue.getQueue(guildId);
  if (!serverQueue) {
    logger.error(`❌ No hay nada reproduciéndose en el servidor con ID: ${guildId}`);
    throw new Error("❌ No hay nada reproduciéndose.");
  }

  return serverQueue;
};

/**
 * Verifica si la música está en reproducción.
 */
const checkIfPlaying = (serverQueue) => {
  if (serverQueue.player.state.status !== AudioPlayerStatus.Playing) {
    logger.error(`❌ La música no está reproduciéndose en el servidor con ID: ${serverQueue.guildId}`);
    throw new Error("❌ La música no se está reproduciendo.");
  }
};

/**
 * Pausa la reproducción de la música.
 */
const pauseMusic = (serverQueue) => {
  try {
    serverQueue.player.pause();
    logger.info(`✅ La reproducción fue pausada en el servidor con ID: ${serverQueue.guildId}`);
  } catch (error) {
    logger.error(`❌ Error al pausar la música en el servidor con ID: ${serverQueue.guildId}: ${error}`);
    throw new Error("❌ Ocurrió un error al pausar la reproducción.");
  }
};

/**
 * Manejador principal del comando /pause.
 */
const handleCommandPause = async (interaction) => {
  logger.info(`Comando /pause ejecutado por: ${interaction.user.tag}`);

  const guildId = interaction.guild?.id;  // Asegurándonos de que la propiedad guild exista.

  if (!guildId) {
    logger.error("❌ No se pudo obtener el ID del servidor.");
    return interaction.reply({
      content: "❌ No se ha detectado un servidor válido.",
      flags: 64,
    });
  }

  logger.info(`ID del servidor: ${guildId}`);

  try {
    const serverQueue = checkServerQueue(guildId); // Verifica que haya una cola de reproducción
    checkIfPlaying(serverQueue); // Verifica si la música está en reproducción
    pauseMusic(serverQueue); // Pausa la música

    return interaction.reply({
      content: "⏸️ Reproducción pausada.",
      flags: 64,
    });
  } catch (error) {
    logger.error("❌ Error en el comando /pause:", error);
    return interaction.reply({
      content: error.message,
      flags: 64,
    });
  }
};

module.exports = { handleCommandPause };
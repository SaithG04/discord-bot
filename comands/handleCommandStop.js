const logger = require("../logger");
const { getQueue, deleteQueue } = require("../queue"); // Acceso modular a la cola

/**
 * Verifica si existe una cola de reproducción activa.
 */
const checkServerQueue = (guildId) => {
  const serverQueue = getQueue(guildId);

  if (!serverQueue) {
    logger.error(`❌ No hay nada en la cola en el servidor con ID: ${guildId}`);
    throw new Error("❌ No hay nada que detener.");
  }

  return serverQueue;
};

/**
 * Detiene la reproducción y desconecta el bot del canal de voz.
 */
const stopMusic = (serverQueue) => {
  try {
    serverQueue.player.stop(); // Detiene el reproductor

    if (serverQueue.connection && serverQueue.connection.state.status !== "destroyed") {
      serverQueue.connection.destroy(); // Desconecta el bot del canal de voz
    }

    deleteQueue(serverQueue.guildId); // Elimina la cola del servidor
    logger.info(`✅ Reproducción detenida y bot desconectado del canal.`);
  } catch (err) {
    logger.error(`❌ Error al detener la reproducción: ${err.message}`);
    throw new Error("❌ Ocurrió un error al detener la reproducción.");
  }
};

/**
 * Manejador principal del comando /stop.
 */
const handleCommandStop = async (interaction) => {
  logger.info(`Comando /stop ejecutado por: ${interaction.user.tag}`);
  const guildId = interaction.guild.id;

  try {
    const serverQueue = checkServerQueue(guildId);
    stopMusic(serverQueue);

    return interaction.reply({
      content: "⏹️ Reproducción detenida y bot desconectado del canal.",
      flags: 64,
    });
  } catch (error) {
    logger.error(`❌ Error en el comando /stop: ${error.message}`);
    return interaction.reply({
      content: error.message,
      ephemeral: true,
    });
  }
};

module.exports = { handleCommandStop };
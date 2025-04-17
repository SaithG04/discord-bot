const EmptyQueueError = require("../errors/EmptyQueueError");
const logger = require("../logger");
const { getQueue } = require("../queue");

/**
 * Verifica si la cola está vacía o no existe.
 */
const checkQueue = (guildId) => {
  const serverQueue = getQueue(guildId);

  if (!serverQueue || !serverQueue.songs || serverQueue.songs.length === 0) {
    logger.error(`❌ No hay canciones en la cola en el servidor con ID: ${guildId}`);
    throw new EmptyQueueError();
  }

  return serverQueue;
};

/**
 * Formatea la lista de canciones en la cola.
 */
const formatQueueList = (serverQueue) => {
  return serverQueue.songs
    .map((song, index) =>
      index === 0
        ? `🎵 Reproduciendo ahora: **${song.title}**`
        : `${index}. ${song.title}`
    )
    .join("\n");
};

/**
 * Manejador principal del comando /queue.
 */
const handleCommandQueue = async (interaction) => {
  logger.info(`Comando /queue ejecutado por: ${interaction.user.tag}`);
  const guildId = interaction.guild.id;

  try {
    const serverQueue = checkQueue(guildId);
    const list = formatQueueList(serverQueue);

    logger.info(`✅ ${interaction.user.tag} solicitó la cola.`);

    return interaction.reply({
      content: `🎶 **Cola de reproducción:**\n${list}`,
      flags: 64, // Ephemeral
    });
  } catch (error) {
    logger.error(`❌ Error al obtener la cola: ${error.message}`);

    return interaction.reply({
      content: error instanceof EmptyQueueError
        ? error.message
        : "⚠️ Ocurrió un error al intentar mostrar la cola.",
      flags: 64,
    });
  }
};

module.exports = { handleCommandQueue };
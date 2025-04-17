const { getQueue, setQueue } = require("../queue");
const logger = require("../logger");

const handleCommandSkip = async (interaction) => {
  logger.info(`⏭️ Comando /skip ejecutado por: ${interaction.user.tag}`);
  await interaction.deferReply();

  const guildId = interaction.guild.id;
  const serverQueue = getQueue(guildId);

  if (!serverQueue || serverQueue.songs.length === 0) {
    logger.warn("⚠️ No hay canciones en la cola para saltar.");
    await interaction.editReply("⚠️ No hay canciones en la cola para saltar.");
    return;
  }

  serverQueue.songs.shift();
  const nextSong = serverQueue.songs[0];

  if (nextSong) {
    logger.info(`⏭️ Saltando a la siguiente canción: ${nextSong.title}`);

    // Detener la canción actual
    serverQueue.player.stop();

    // Reproducir la siguiente
    serverQueue.play(nextSong);
    setQueue(guildId, serverQueue);

    await interaction.editReply(`⏭️ Saltando a: **${nextSong.title}**`);
  } else {
    logger.info("🛑 No hay más canciones en la cola.");
    serverQueue.player.stop(); // Detener cualquier reproducción en curso
    await interaction.editReply("🛑 No hay más canciones en la cola.");
  }
};

module.exports = { handleCommandSkip };
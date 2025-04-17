const { joinVoiceChannel } = require('@discordjs/voice');
const logger = require('../logger');

/**
 * Verifica si el usuario está en un canal de voz.
 */
const isUserInVoiceChannel = (member) => {
  if (!member.voice.channel) {
    logger.error(`❌ ${member.user.tag} intentó unirse a un canal de voz sin estar en uno.`);
    return false;
  }
  return true;
};

/**
 * Intenta que el bot se una al canal de voz del usuario.
 */
const joinVoiceChannelHandler = async (guildId, channelId, adapterCreator) => {
  try {
    const connection = joinVoiceChannel({
      channelId: channelId,
      guildId: guildId,
      adapterCreator: adapterCreator,
      selfDeaf: false,
    });
    logger.info(`✅ El bot se ha unido al canal de voz.`);
    return connection;
  } catch (err) {
    logger.error("❌ Error al unirse al canal de voz:", err);
    throw new Error("No pude unirme al canal de voz.");
  }
};

/**
 * Manejador principal del comando /join.
 */
const handleCommandJoin = async (interaction) => {
  logger.info(`Comando /join ejecutado por: ${interaction.user.tag}`);

  const member = interaction.guild.members.cache.get(interaction.user.id);

  if (!isUserInVoiceChannel(member)) {
    return interaction.reply({
      content: "❌ Debes estar en un canal de voz para que me una.",
      flags: 64,
    });
  }

  try {
    await joinVoiceChannelHandler(interaction.guild.id, member.voice.channel.id, interaction.guild.voiceAdapterCreator);
    await interaction.reply({
      content: `✅ Me uní al canal de voz: ${member.voice.channel.name}`,
      flags: 64,
    });
    logger.info(`✅ Bot unido al canal de voz ${member.voice.channel.name}`);
  } catch (error) {
    await interaction.reply({
      content: "❌ No pude unirme al canal de voz.",
      flags: 64,
    });
  }
};

module.exports = { handleCommandJoin };
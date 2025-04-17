const { getVoiceConnection } = require("@discordjs/voice");
const logger = require("../logger");

/**
 * Verifica si el usuario está en un canal de voz.
 */
const isUserInVoiceChannel = (member) => {
  if (!member.voice.channel) {
    logger.error(`❌ ${member.user.tag} intentó desconectarse sin estar en un canal de voz.`);
    return false;
  }
  return true;
};

/**
 * Verifica si el bot está en un canal de voz.
 */
const isBotInVoiceChannel = (botMember) => {
  if (!botMember.voice.channel) {
    logger.error(`❌ El bot intentó desconectarse sin estar en un canal de voz.`);
    return false;
  }
  return true;
};

/**
 * Verifica si el bot está en el mismo canal de voz que el usuario.
 */
const isBotInSameChannel = (botChannel, userChannel) => {
  if (botChannel.id !== userChannel.id) {
    logger.error(`❌ El bot intentó desconectarse sin estar en el mismo canal que el usuario.`);
    return false;
  }
  return true;
};

/**
 * Desconecta al bot del canal de voz.
 */
const leaveVoiceChannel = async (guildId) => {
  try {
    const connection = getVoiceConnection(guildId);
    if (connection) {
      connection.destroy();
      logger.info(`✅ El bot se ha desconectado del canal de voz.`);
    }
  } catch (err) {
    logger.error("❌ Error al desconectar el bot del canal de voz:", err);
    throw new Error("No pude desconectarme del canal de voz.");
  }
};

/**
 * Manejador principal del comando /leave.
 */
const handleCommandLeave = async (interaction) => {
  logger.info(`Comando /leave ejecutado por: ${interaction.user.tag}`);

  const member = interaction.guild.members.cache.get(interaction.user.id);
  const botChannel = interaction.guild.members.me.voice.channel;

  if (!isUserInVoiceChannel(member)) {
    return interaction.reply({
      content: "❌ Debes estar en un canal de voz para que me salga de él.",
      flags: 64,
    });
  }

  if (!isBotInVoiceChannel(interaction.guild.members.me)) {
    return interaction.reply({
      content: "❌ No estoy conectado a ningún canal de voz.",
      flags: 64,
    });
  }

  if (!isBotInSameChannel(botChannel, member.voice.channel)) {
    return interaction.reply({
      content: "❌ No estoy en el mismo canal de voz que tú.",
      flags: 64,
    });
  }

  try {
    await leaveVoiceChannel(interaction.guild.id);
    await interaction.reply({
      content: `✅ Me he salido del canal de voz: ${botChannel.name}`,
      flags: 64,
    });
  } catch (error) {
    return interaction.reply({
      content: "❌ No pude desconectarme del canal de voz.",
      flags: 64,
    });
  }
};

module.exports = { handleCommandLeave };
const logger = require('../logger');

/**
 * Manejador principal del comando /mute.
 */
const handleCommandMute = async (interaction) => {
  const invoker = interaction.user ?? interaction.member?.user;
  logger.info(`Comando /mute ejecutado por: ${invoker?.tag}`);

  // Verifica que el usuario tenga permisos para silenciar miembros
  if (!interaction.member.permissions.has("MuteMembers")) {
    logger.error(`❌ ${invoker?.tag} no tiene permiso para silenciar miembros.`);
    return interaction.reply({
      content: "❌ No tienes permiso para silenciar miembros.",
      flags: 64,
    });
  }

  const user = interaction.options.getUser("usuario");
  const member = interaction.guild.members.cache.get(user.id);

  // Verifica si el miembro existe
  if (!member) {
    logger.error(`❌ ${invoker?.tag} intentó silenciar un usuario no válido: ${user.tag}`);
    return interaction.reply({
      content: "❌ Usuario no válido.",
      flags: 64,
    });
  }

  const botMember = interaction.guild.members.me;
  const botVoiceChannel = botMember?.voice?.channel;
  const targetVoiceChannel = member.voice?.channel;

  // Verifica si el bot está en un canal de voz
  if (!botVoiceChannel) {
    logger.error(`❌ ${invoker?.tag} intentó silenciar a un usuario sin que el bot esté en un canal de voz.`);
    return interaction.reply({
      content: "❌ No estoy conectado a ningún canal de voz.",
      flags: 64,
    });
  }

  // Verifica si el miembro objetivo está en el mismo canal de voz que el bot
  if (!targetVoiceChannel || botVoiceChannel.id !== targetVoiceChannel.id) {
    logger.error(`❌ ${invoker?.tag} intentó silenciar a un usuario que no está en el mismo canal de voz.`);
    return interaction.reply({
      content: `❌ El usuario **${user.tag}** no está en el mismo canal de voz que yo.`,
      flags: 64,
    });
  }

  // Intenta silenciar al miembro
  try {
    await member.voice.setMute(true); // Silencia al miembro
    await interaction.reply(`✅ ${user.tag} ha sido silenciado.`);
    logger.info(`✅ ${invoker?.tag} silenció a ${user.tag} en el canal de voz.`);
  } catch (err) {
    logger.error(err);
    await interaction.reply({
      content: "❌ No se pudo silenciar a ese usuario.",
      flags: 64,
    });
  }
};

module.exports = { handleCommandMute };
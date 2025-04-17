const logger = require('../logger');

/**
 * Manejador principal del comando /unmute.
 */
const handleCommandUnmute = async (interaction) => {
  logger.info(`Comando /unmute ejecutado por: ${interaction.user.tag}`);
  
  // Verifica que el usuario tenga permisos para desilenciar miembros
  if (!interaction.member.permissions.has("MUTE_MEMBERS")) {
    logger.error(`❌ ${interaction.user.tag} no tiene permiso para desilenciar miembros.`);
    return interaction.reply({
      content: "❌ No tienes permiso para desilenciar miembros.",
      flags: 64,
    });
  }

  const user = interaction.options.getUser("usuario");
  const member = interaction.guild.members.cache.get(user.id);

  // Verifica si el miembro existe
  if (!member) {
    logger.error(`❌ ${interaction.user.tag} intentó desilenciar un usuario no válido: ${user.tag}`);
    return interaction.reply({
      content: "❌ Usuario no válido.",
      flags: 64,
    });
  }

  // Intenta desilenciar al miembro
  try {
    await member.voice.setMute(false); // Desilencia al miembro
    await interaction.reply(`✅ ${user.tag} ha sido desilenciado.`);
    logger.info(`✅ ${interaction.user.tag} desilenció a ${user.tag} en el canal de voz.`);
  } catch (err) {
    logger.error(err);
    await interaction.reply({
      content: "❌ No se pudo desilenciar a ese usuario.",
      flags: 64,
    });
  }
};

module.exports = { handleCommandUnmute };
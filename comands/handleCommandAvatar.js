const logger = require("../logger");

/**
 * Manejador principal del comando /avatar.
 */
const handleCommandAvatar = async (interaction) => {
  logger.info(`Comando /avatar ejecutado por: ${interaction.user.tag}`);
  
  const user = interaction.options.getUser("usuario") || interaction.user;
  const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

  await interaction.reply({
    content: `Aquí está el avatar de ${user.tag}: ${avatarURL}`,
    flags: 64,
  });

  logger.info(`✅ Avatar de ${user.tag} enviado.`);
};

module.exports = { handleCommandAvatar };
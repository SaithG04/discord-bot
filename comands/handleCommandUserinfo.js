const logger = require('../logger');

/**
 * Formatea la información del usuario.
 */
const formatUserInfo = (user, member) => {
  return `
    **Información de ${user.username}:**
    • **Nombre:** ${user.tag}
    • **ID:** ${user.id}
    • **Fecha de creación:** ${user.createdAt.toDateString()}
    • **Fecha de ingreso al servidor:** ${member.joinedAt.toDateString()}
    • **Roles:** ${member.roles.cache.map((role) => role.name).join(", ") || "Ninguno"}
    • **Estado:** ${user.presence ? user.presence.status : "No disponible"}
    • **Avatar:** [Ver Avatar](${user.displayAvatarURL({ dynamic: true, size: 1024 })})
    • **Bot:** ${user.bot ? "Sí" : "No"}
    • **Apodo:** ${member.nickname || "Ninguno"}
    • **Color del rol principal:** ${member.displayHexColor || "Ninguno"}
  `;
};

/**
 * Manejador principal del comando /userinfo.
 */
const handleCommandUserinfo = async (interaction) => {
  logger.info(`Comando /userinfo ejecutado por: ${interaction.user.tag}`);

  const user = interaction.options.getUser("usuario") || interaction.user;
  const member = interaction.guild.members.cache.get(user.id);

  const userInfo = formatUserInfo(user, member);

  await interaction.reply(userInfo);

  logger.info(`✅ ${interaction.user.tag} obtuvo información de ${user.tag}.`);
};

module.exports = { handleCommandUserinfo };
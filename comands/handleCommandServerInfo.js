const logger = require('../logger');

/**
 * Formatea la información del servidor.
 */
const formatServerInfo = (guild, owner) => {
  return `
    **===== INFORMACIÓN DEL SERVIDOR =====**
    • **Nombre del servidor:** ${guild.name}
    • **ID del servidor:** ${guild.id}
    • **Miembros:** ${guild.memberCount}
    • **Creador:** ${owner.user.tag}
    • **Fecha de creación:** ${guild.createdAt.toDateString()}
    • **Región:** ${guild.preferredLocale}
    • **Roles:** ${guild.roles.cache.map((role) => role.name).join(", ") || "Ninguno"}
    • **Canales:** ${guild.channels.cache.map((channel) => channel.name).join(", ") || "Ninguno"}
    • **Emojis:** ${guild.emojis.cache.map((emoji) => emoji.name).join(", ") || "Ninguno"}
    • **Boosts:** ${guild.premiumSubscriptionCount || 0}
    • **Nivel de Boost:** ${guild.premiumTier || "Ninguno"}
    • **Verificación:** ${guild.verificationLevel}
    • **Sistema de moderación:** ${guild.mfaLevel}
    • **Icono del servidor:** [Ver Icono](${guild.iconURL({ dynamic: true, size: 1024 })})
    • **Banner del servidor:** [Ver Banner](${guild.bannerURL({ dynamic: true, size: 1024 })})
    • **Descripción del servidor:** ${guild.description || "Ninguna"}
  `;
};

/**
 * Manejador principal del comando /serverinfo.
 */
const handleCommandServerInfo = async (interaction) => {
  logger.info(`Comando /serverinfo ejecutado por: ${interaction.user.tag}`);

  if (!interaction.member.permissions.has("VIEW_AUDIT_LOG")) {
    logger.error(`❌ ${interaction.user.tag} no tiene permiso para ver la información del servidor.`);
    return interaction.reply({
      content: "❌ No tienes permiso para ver la información del servidor.",
      flags: 64,
    });
  }

  if (!interaction.guild) {
    logger.error(`❌ ${interaction.user.tag} intentó obtener información de un servidor no válido.`);
    return interaction.reply({
      content: "❌ No pude obtener la información del servidor.",
      flags: 64,
    });
  }

  const owner = await interaction.guild.fetchOwner();
  const serverInfo = formatServerInfo(interaction.guild, owner);

  await interaction.reply(serverInfo);

  logger.info(`✅ ${interaction.user.tag} obtuvo información del servidor: ${interaction.guild.name}`);
};

module.exports = { handleCommandServerInfo };
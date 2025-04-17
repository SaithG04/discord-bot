const logger = require('../logger');

/**
 * Manejador principal del comando /ban.
 */
const handleCommandBan = async (interaction) => {
  const invoker = interaction.user ?? interaction.member?.user;
  logger.info(`Comando /ban ejecutado por: ${invoker?.tag}`);

  // Verifica que el usuario tenga permisos para banear miembros
  if (!interaction.member.permissions.has("BAN_MEMBERS")) {
    logger.error(`❌ ${invoker?.tag} no tiene permiso para banear miembros.`);
    return interaction.reply({
      content: "❌ No tienes permiso para banear miembros.",
      flags: 64,
    });
  }

  const user = interaction.options.getUser("usuario");
  const reason =
    interaction.options.getString("razon") || "Baneado por un bot";
  const member = interaction.guild.members.cache.get(user.id);

  // Verifica si el miembro existe
  if (!member) {
    logger.error(`❌ ${invoker?.tag} intentó banear un usuario no válido: ${user.tag}`);
    return interaction.reply({
      content: "❌ Usuario no válido.",
      flags: 64,
    });
  }

  // Intenta banear al miembro
  try {
    await member.ban({ reason }); // Banea al miembro
    await interaction.reply(`✅ ${user.tag} ha sido baneado.`);
    logger.info(`✅ ${invoker?.tag} baneó a ${user.tag} del servidor.`);
  } catch (err) {
    logger.error(err);
    await interaction.reply({
      content: "❌ No se pudo banear a ese usuario.",
      flags: 64,
    });
  }
};

module.exports = { handleCommandBan };
const logger = require('../logger');

/**
 * Manejador principal del comando /kick.
 */
const handleCommandKick = async (interaction) => {
  const invoker = interaction.user ?? interaction.member?.user;
  logger.info(`Comando /kick ejecutado por: ${invoker?.tag}`);

  // Verifica que el usuario tenga permisos para expulsar miembros
  if (!interaction.member.permissions.has("KICK_MEMBERS")) {
    logger.error(`❌ ${invoker?.tag} no tiene permiso para expulsar miembros.`);
    return interaction.reply({
      content: "❌ No tienes permiso para expulsar miembros.",
      flags: 64,
    });
  }

  const user = interaction.options.getUser("usuario");
  const reason =
    interaction.options.getString("razon") || "Expulsado por un bot";
  const member = interaction.guild.members.cache.get(user.id);

  // Verifica si el miembro existe
  if (!member) {
    logger.error(`❌ ${invoker?.tag} intentó expulsar un usuario no válido: ${user.tag}`);
    return interaction.reply({
      content: "❌ Usuario no válido.",
      flags: 64,
    });
  }

  // Intenta expulsar al miembro
  try {
    await member.kick(reason); // Expulsa al miembro
    await interaction.reply(`✅ ${user.tag} ha sido expulsado.`);
    logger.info(`✅ ${invoker?.tag} expulsó a ${user.tag} del servidor.`);
  } catch (err) {
    logger.error(err);
    await interaction.reply({
      content: "❌ No se pudo expulsar a ese usuario.",
      flags: 64,
    });
  }
};

module.exports = { handleCommandKick };
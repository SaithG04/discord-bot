const logger = require("../logger");

/**
 * Manejador principal del comando /clear.
 */
const handleCommandClear = async (interaction) => {
  const invoker = interaction.user ?? interaction.member?.user;
  logger.info(`Comando /clear ejecutado por: ${invoker?.tag}`);

  // Verifica si ya ha sido respondida o diferida
  if (!interaction.replied) {
    await interaction.deferReply(); // Confirmamos que estamos procesando la interacción
  }

  // Verifica que el usuario tenga permisos para borrar mensajes
  if (!interaction.member.permissions.has("ManageMessages")) {
    logger.error(`❌ ${invoker?.tag} no tiene permiso para borrar mensajes.`);
    return interaction.editReply({
      content: "❌ No tienes permiso para borrar mensajes.",
      flags: 64,
    });
  }

  const amount = interaction.options.getInteger("amount");

  // Verifica que la cantidad de mensajes sea válida
  if (amount < 1 || amount > 100) {
    logger.error(
      `❌ ${invoker?.tag} intentó borrar un número inválido de mensajes: ${amount}`,
    );
    return interaction.editReply({
      content: "❌ Ingresa un número válido entre 1 y 100.",
      flags: 64,
    });
  }

  // Intenta borrar los mensajes
  try {
    await interaction.channel.bulkDelete(amount + 1, true); // +1 para excluir el mensaje del comando
    return interaction.editReply({
      content: `🧹 Se borraron ${amount} mensajes.`,
      flags: 64,
    });
  } catch (err) {
    logger.error(err);
    return interaction.editReply({
      content: "❌ Ocurrió un error al borrar los mensajes.",
      flags: 64,
    });
  }
};

module.exports = { handleCommandClear };
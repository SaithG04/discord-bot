const logger = require("../logger");

/**
 * Formatea el mensaje de ayuda con todos los comandos disponibles.
 */
const formatHelpMessage = () => {
  return `
    **Comandos disponibles:**
    • /info - Información sobre el bot.
    • /clear <amount> - Borra un número de mensajes.
    • /kick <usuario> [razon] - Expulsa a un usuario.
    • /ban <usuario> [razon] - Banea a un usuario.
    • /mute <usuario> - Silencia a un usuario en el canal de voz.
    • /unmute <usuario> - Desilencia a un usuario en el canal de voz.
    • /avatar [usuario] - Muestra el avatar de un usuario.
    • /serverinfo - Información del servidor.
    • /userinfo [usuario] - Información de un usuario.
    • /help - Lista de comandos.
  `;
};

/**
 * Manejador principal del comando /help.
 */
const handleCommandHelp = async (interaction) => {
  logger.info("Comando /help ejecutado por:", interaction.user.tag);
  
  try {
    const helpMessage = formatHelpMessage(); // Formatea el mensaje de ayuda
    return await interaction.reply(helpMessage);
  } catch (error) {
    logger.error("❌ Error al ejecutar el comando /help:", error);
    return interaction.reply({
      content: "❌ Ocurrió un error al mostrar los comandos.",
      ephemeral: true,
    });
  }
};

module.exports = { handleCommandHelp };
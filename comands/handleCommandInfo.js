const logger = require('../logger');

/**
 * Manejador principal del comando /info.
 */
const handleCommandInfo = async (interaction, client) => {
  const invoker = interaction.user ?? interaction.member?.user;
  logger.info(`Comando /info ejecutado por: ${invoker?.tag}`);

  const botInfo = `
  **Información del bot:**
  • **Nombre:** ${client.user.username}
  • **Versión:** 1.0.0
  • **Lenguaje de programación:** Node.js
  • **Creador:** SaithG04
  • **Fecha de creación:** 15 Abril 2025
  • **Propósito:** Ayudar a gestionar y moderar el servidor con comandos útiles.

  ¡Gracias por usarme! 😄
  `;

  await interaction.reply(botInfo);
};

module.exports = { handleCommandInfo };
// resetComands.js
require("dotenv").config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

let token = process.env.TOKEN;
let clientId = process.env.CLIENT_ID;
let guildId = process.env.GUILD_ID;

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    logger.info('Reseteando comandos...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [] },
    );
    logger.info('Comandos resetados correctamente.');
  } catch (error) {
    logger.error('Hubo un error al resetear los comandos:', error);
  }
})();
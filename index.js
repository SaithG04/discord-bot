require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { handleCommandPlay } = require("./comands/handleCommandPlay");
const { handleCommandPause } = require("./comands/handleCommandPause");
const { handleCommandResume } = require("./comands/handleCommandResume");
const { handleCommandStop } = require("./comands/handleCommandStop");
const { handleCommandSkip } = require("./comands/handleCommandSkip");
const { handleCommandQueue } = require("./comands/handleCommandQueue");
const { handleCommandHelp } = require("./comands/handleCommandHelp");
const { handleCommandLeave } = require("./comands/handleCommandLeave");
const { handleCommandJoin } = require("./comands/handleCommandJoin");
const { handleCommandUserinfo } = require("./comands/handleCommandUserinfo");
const { handleCommandServerInfo } = require("./comands/handleCommandServerInfo");
const { handleCommandAvatar } = require("./comands/handleCommandAvatar");
const { handleCommandUnmute } = require("./comands/handleCommandUnmute");
const { handleCommandMute } = require("./comands/handleCommandMute");
const { handleCommandBan } = require("./comands/handleCommandBan");
const { handleCommandKick } = require("./comands/handleCommandKick");
const { handleCommandClear } = require("./comands/handleCommandClear");
const { handleCommandInfo } = require("./comands/handleCommandInfo");
const commands = require("./comands/slashCommands");
const logger = require("./logger");

let token = process.env.TOKEN;
let clientId = process.env.CLIENT_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", async () => {
  logger.info(`✅ Bot conectado como ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    logger.info("Empezando a registrar comandos slash...");

    // Registrar comandos en todos los servidores
    await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    logger.info("✅ Comandos slash registrados correctamente en todos los servidores.");
  } catch (error) {
    logger.error("❌ Hubo un error al registrar los comandos:", error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  const commandHandlers = {
    info: handleCommandInfo,
    clear: handleCommandClear,
    kick: handleCommandKick,
    ban: handleCommandBan,
    mute: handleCommandMute,
    unmute: handleCommandUnmute,
    avatar: handleCommandAvatar,
    serverinfo: handleCommandServerInfo,
    userinfo: handleCommandUserinfo,
    join: handleCommandJoin,
    leave: handleCommandLeave,
    play: handleCommandPlay,
    pause: handleCommandPause,
    resume: handleCommandResume,
    stop: handleCommandStop,
    skip: handleCommandSkip,
    queue: handleCommandQueue,
    help: handleCommandHelp,
  };

  const handler = commandHandlers[commandName];
  if (handler) {
    await handler(interaction);
  } else {
    logger.warn(`⚠️ Comando desconocido: /${commandName}`);
    await interaction.reply({
      content: "❌ Comando no reconocido.",
      flags: 64,
    });
  }
});

client.login(token);

process.on("SIGINT", () => {
  logger.info("Interrupción manual. Desconectando el bot...");
  client.destroy();
  logger.info("Bot desconectado. Cerrando...");
  process.exit(0);
});
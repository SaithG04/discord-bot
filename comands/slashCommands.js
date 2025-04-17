const { SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Muestra información del bot"),

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Borra un número de mensajes del canal (1-100)")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Número de mensajes a borrar")
        .setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a expulsar")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("razon")
        .setDescription("Razón de la expulsión (opcional)")
        .setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a banear")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("razon")
        .setDescription("Razón del baneo (opcional)")
        .setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Silencia a un usuario en el canal de voz")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a silenciar")
        .setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Desilencia a un usuario en el canal de voz")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a desilenciar")
        .setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Muestra el avatar de un usuario")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario (opcional)")
        .setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Muestra información del servidor"),

  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información de un usuario")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("El usuario a consultar (opcional)")
        .setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName("join")
    .setDescription(
      "Hace que el bot se una al canal de voz donde estás conectado",
    ),

  new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Hace que el bot se salga del canal de voz."),

  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Reproduce una canción desde YouTube por URL o nombre")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("URL del video de YouTube o nombre de la canción")
        .setRequired(true),
    ),

  new SlashCommandBuilder().setName("stop").setDescription("Detiene la música"),

  new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Detiene la canción actual"),

  new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Reanuda la música"),

  new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Salta a la siguiente canción"),

  new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra la cola actual"),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lista de comandos disponibles"),
].map((command) => command.toJSON());

module.exports = commands;

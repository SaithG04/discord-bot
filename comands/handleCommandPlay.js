const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
} = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");
const playdl = require("play-dl");
const logger = require("../logger");
const { getQueue, setQueue, deleteQueue } = require("../queue");
const VoiceChannelRequiredError = require("../errors/VoiceChannelRequiredError");
const SongNotFoundError = require("../errors/SongNotFoundError");

/**
 * Verifica si el usuario está en un canal de voz.
 */
const checkUserInVoiceChannel = (interaction) => {
  const member = interaction.guild.members.cache.get(interaction.user.id);
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    logger.error(`❌ ${interaction.user.tag} intentó reproducir música sin estar en un canal de voz.`);
    throw new VoiceChannelRequiredError();
  }

  return voiceChannel;
};

/**
 * Busca y obtiene la canción.
 */
const getSong = async (input) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  let song;

  if (youtubeRegex.test(input)) {
    const info = await playdl.video_basic_info(input);
    song = { url: input, title: info.video_details.title };
    logger.info(`🎵 URL detectada. Título: ${song.title}`);
  } else {
    const searchResults = await playdl.search(input, {
      limit: 1,
      source: { youtube: "video" },
    });

    if (searchResults.length === 0) {
      logger.error(`❌ No se encontró ninguna coincidencia para: ${input}.`);
      throw new SongNotFoundError();
    }

    const result = searchResults[0];
    song = { url: result.url, title: result.title };
    logger.info(`🔍 Resultado de búsqueda: ${song.title} (${song.url})`);
  }

  return song;
};

/**
 * Crea la conexión al canal de voz.
 */
const createConnection = (voiceChannel, guildId, interaction) => {
  return joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });
};

/**
 * Maneja la reproducción de la canción.
 */
const playSong = async (song, guildId, interaction, voiceChannel) => {
  let serverQueue = getQueue(guildId);
  const player = createAudioPlayer();
  const songs = serverQueue?.songs || [song];
  let connection = getVoiceConnection(guildId);

  const play = async (song) => {
    if (!song) {
      logger.info("⚠️ No hay canción en la cola. Cerrando conexión.");
      deleteQueue(guildId);
      if (connection && connection.state.status !== "destroyed") {
        connection.destroy();
      }
      return;
    }

    let stream;
    try {
      stream = ytdl(song.url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      });
      logger.info("✅ Stream obtenido con ytdl-core para:", song.title);
    } catch (err) {
      logger.error("❌ Error al obtener el stream con ytdl-core:", err);
      serverQueue.songs.shift();
      return play(serverQueue.songs[0]);
    }

    player.removeAllListeners();

    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      logger.info(`▶️ Reproduciendo: ${song.title}`);
    });

    player.once(AudioPlayerStatus.Idle, () => {
      logger.info(`⏹️ Canción terminada: ${song.title}`);
      serverQueue = getQueue(guildId); // Reobtener en caso de cambios
      if (serverQueue) {
        serverQueue.songs.shift();
        setQueue(guildId, serverQueue); // Actualiza la cola
        play(serverQueue.songs[0]);
      }
    });

    player.on("error", (error) => {
      logger.error("❌ Error en el AudioPlayer:", error.message);
      serverQueue = getQueue(guildId); // Reobtener en caso de cambios
      if (serverQueue) {
        serverQueue.songs.shift();
        setQueue(guildId, serverQueue); // Actualiza la cola
        play(serverQueue.songs[0]);
      }
    });
  };

  if (!serverQueue) {
    connection = createConnection(voiceChannel, guildId, interaction);
    setQueue(guildId, { guildId, connection, player, songs, play });
    await interaction.editReply(`▶️ Reproduciendo: **${song.title}**`);
    play(song);
  } else {
    serverQueue.songs.push(song);
    setQueue(guildId, serverQueue); // Actualiza la cola con la nueva canción
    await interaction.editReply(`🎵 Añadido a la cola: **${song.title}**`);
  }
};

/**
 * Manejador principal del comando /play.
 */
const handleCommandPlay = async (interaction) => {
  logger.info(`Comando /play ejecutado por: ${interaction.user.tag}`);
  await interaction.deferReply();

  const input = interaction.options.getString("query");
  const guildId = interaction.guild.id;

  try {
    const voiceChannel = checkUserInVoiceChannel(interaction);
    const song = await getSong(input);

    await playSong(song, guildId, interaction, voiceChannel);
  } catch (error) {
    if (error instanceof VoiceChannelRequiredError || error instanceof SongNotFoundError) {
      await interaction.editReply(error.message);
    } else {
      logger.error("❌ Error inesperado:", error);
      await interaction.editReply("⚠️ Ocurrió un error al intentar reproducir la canción.");
    }
  }
};

module.exports = { handleCommandPlay };
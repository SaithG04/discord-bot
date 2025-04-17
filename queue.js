const queue = new Map();

/**
 * Devuelve la cola del servidor.
 */
const getQueue = (guildId) => {
  return queue.get(guildId);
};

/**
 * Establece o actualiza la cola del servidor.
 */
const setQueue = (guildId, data) => {
  queue.set(guildId, data);
};

/**
 * Elimina la cola del servidor.
 */
const deleteQueue = (guildId) => {
  queue.delete(guildId);
};

/**
 * Devuelve true si existe cola para el servidor.
 */
const hasQueue = (guildId) => {
  return queue.has(guildId);
};

/**
 * Devuelve la cola completa (para depuración u otros fines).
 */
const getAllQueues = () => {
  return queue;
};

module.exports = {
  getQueue,
  setQueue,
  deleteQueue,
  hasQueue,
  getAllQueues,
};
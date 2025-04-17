class EmptyQueueError extends Error {
    constructor(message = "📭 La cola está vacía.") {
      super(message);
      this.name = "EmptyQueueError";
    }
  }
  
module.exports = EmptyQueueError;  
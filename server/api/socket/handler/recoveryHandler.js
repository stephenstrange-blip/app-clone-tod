const { getManyMessage } = require("../../db/database");

module.exports = async (io, socket) => {
  try {
    const where = {
      id: {
        gt: Number(socket.handshake.auth.serverOffset) || 0,
      },
    };

    const select = {
      id: true,
      content: true,
      authorId: true,
    };

    const messages = await getManyMessage({ where, select });

    if (messages.length > 0)
      for (let message of messages) {
        if (message.authorId === socket.request.user.id)
          message["myMessage"] = true;
        socket.emit("chat", message);
      }

  } catch (err) {
    console.error(err);
  }
};

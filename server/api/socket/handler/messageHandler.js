const { addMessage, getRoom } = require("../../db/database");

module.exports = (io, socket) => {
  socket.on("chat", async (input, clientOffset, roomId, callback) => {
    let result,
      room,
      user = socket.request.user;

    try {
      console.log(`A user is saying, ${input}`);
      const data = {
        content: input,
        roomId: Number(roomId),
        authorId: user.id,
        clientOffset,
      };

      result = await addMessage({ data });
      room = await getRoom({ roomId: Number(roomId) });
    } catch (err) {
      if (err.errno === 19) callback();
      else console.error(err);

      // by not calling callback and returning, client socket retries to emit
      return;
    }

    // Do not flag the message when sending to others, except for the author
    socket.emit("chat", { content: input, id: result.id, myMessage: true });
    socket
      .to(room.name || "public")
      .emit("chat", { content: input, id: result.id });
    callback();
  });
};

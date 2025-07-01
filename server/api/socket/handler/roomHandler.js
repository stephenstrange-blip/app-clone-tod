const { getRoom } = require("../../db/database");

module.exports = (io, socket) => {
  socket.on("joinRoom", async (roomId, callback) => {
    console.log(`Joining room with id ${roomId}`);
    const { name } = await getRoom({ roomId: Number(roomId) });
    socket.join(name);
    callback();
  });
};

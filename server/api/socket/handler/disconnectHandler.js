module.exports = (io, socket) => {
  socket.once("disconnect", () => {
    io.of("/chats").emit("fireEvent", "A user disconnected");

    console.log(
      `A user has disconnected. ${io.engine.clientsCount} users is/are still connected`
    );
  });

  socket.once("disconnecting", () => {
    socket.to("public").emit("fireEvent", "Someone in chatroom left");
    console.log("A user is leaving from", socket.rooms);
  });
};

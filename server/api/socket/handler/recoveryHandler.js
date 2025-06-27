module.exports = async (io, socket, db) => {
  try {
    await db.each(
      "SELECT id, content FROM messages WHERE id > ?",
      socket.handshake.auth.serverOffset || 0,
      (_, row) => socket.emit("chat", row.content, row.id)
    );
  } catch (err) {
    console.error(err);
  }
};

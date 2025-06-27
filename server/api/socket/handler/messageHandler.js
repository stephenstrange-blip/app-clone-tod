module.exports = (io, socket, db) => {
  socket.on("chat", async (input) => {
    let result;

    try {
      console.log(`A user is saying, ${input}`);
      result = await db.run("INSERT INTO messages (content) VALUES (?)", input);
      console.log(result);
    } catch (err) {
      return console.error(err);
    }

    io.to("public").emit("chat", input, result.lastID);
  });
};

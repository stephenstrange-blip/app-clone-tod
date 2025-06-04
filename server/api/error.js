const prisma = require("./db/prisma").prisma;

exports.error = async (err, req, res, next) => {
  console.log("ERROR!!");
  console.dir(err.stack);
  await prisma.$disconnect();
  res.status(500).json({ message: err.message, stack: err.stack });
};

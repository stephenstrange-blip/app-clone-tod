const prisma = require("./db/prisma").prisma;
require("dotenv").config();

exports.error = async (err, req, res, next) => {
  console.log("ERROR!!");
  console.dir(err.stack);
  await prisma.$disconnect();
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.status(500).json({ message: err.message, stack: err.stack });
};

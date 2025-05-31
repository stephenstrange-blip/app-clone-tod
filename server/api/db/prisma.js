const { PrismaClient } = require("../../generated/prisma");
const { withBark } = require("prisma-extension-bark");
exports.prisma = new PrismaClient().$extends(
  withBark({ modelNames: ["comment"] }) // use lowercase even if model's first letter is capitalized in schema.prisma
);

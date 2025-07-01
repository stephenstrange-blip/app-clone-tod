const { Router } = require("express");
const { fetchManyMessage } = require("../controllers/chatCtr");

const router = new Router();

router.get("/:chatId", fetchManyMessage);

module.exports = { router };

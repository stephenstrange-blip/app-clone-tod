const { Router } = require("express");
const router = new Router();

const { error } = require("../error");
const { logout } = require("../controllers/logoutCtr");

router.post("/", logout);
router.use(error);

module.exports = { router };

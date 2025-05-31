const { Router } = require("express");
const router = new Router();

const { signup } = require("../controllers/signupCtr");
const { error } = require("../error");

router.post("/", signup);
router.use(error);

module.exports = { router };

const signup = require("./routes/signup").router;
const login = require("./routes/login").router;
const logout = require("./routes/logout").router;
const github = require("./github/github").router;
const user = require("./routes/user").router;

module.exports = { signup, login, logout, github, user };

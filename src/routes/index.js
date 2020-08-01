const express = require('express');
const app = express();

app.use(require('./login.route'));
app.use(require('./usuario.route'));

module.exports = app;
const express = require('express');
const app = express();

app.use(require('./login.route'));
app.use(require('./usuario.route'));
app.use(require('./categoria.route'));
app.use(require('./producto.route'));

module.exports = app;
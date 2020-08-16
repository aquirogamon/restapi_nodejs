const express = require('express');
const fs = require('fs');
const path = require('path');
let { verificationTokenImg } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificationTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    pathImagen = path.resolve(__dirname, `../../img/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        noImagenPath = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(noImagenPath);
    }
});

module.exports = app;
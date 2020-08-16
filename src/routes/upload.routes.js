const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../model/usuario');
const Producto = require('../model/producto');
const path = require('path');
const fs = require('fs');

const app = express();

// Default Options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let idTipo = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    let imagen = req.files.archivo;
    let nombreImagenCortado = imagen.name.split('.');
    let extensionImagen = nombreImagenCortado[nombreImagenCortado.length - 1];

    // Extensiones válidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'gifv', 'jpeg'];

    // Valida Extensión
    if (extensionesValidas.indexOf(extensionImagen) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extensionImagen
            }
        });
    }


    // Tipos Válidos
    let tiposValidos = ['producto', 'usuario'];

    // Valida Tipos
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las tipos permitidos son ' + tiposValidos.join(', '),
                tipo: tipo
            }
        });
    }

    let nombreImagen = `${idTipo}-${new Date().getMilliseconds()}.${extensionImagen}`;

    imagen.mv(`img/${tipo}/${nombreImagen}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        switch (tipo) {
            case 'producto':
                imagenProducto(idTipo, res, nombreImagen, tipo);
                break;

            case 'usuario':
                imagenUsuario(idTipo, res, nombreImagen, tipo);
                break;

            default:
                break;
        }
    });
});

function imagenUsuario(id, res, nombreImagen, tipo) {
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            borraImagen(nombreImagen, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuario) {
            borraImagen(nombreImagen, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no exsite'
                }
            });
        }

        borraImagen(usuario.img, tipo);

        usuario.img = nombreImagen;
        usuario.save((err, usuario) => {
            res.json({
                ok: true,
                usuario,
                img: nombreImagen
            });
        });
    });
}

function imagenProducto(id, res, nombreImagen, tipo) {
    Producto.findById(id, (err, producto) => {
        if (err) {
            borraImagen(nombreImagen, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            borraImagen(nombreImagen, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no exsite'
                }
            });
        }

        borraImagen(producto.img, tipo);

        producto.img = nombreImagen;
        producto.save((err, producto) => {
            res.json({
                ok: true,
                producto,
                img: nombreImagen
            });
        });
    });
}

function borraImagen(nombreImagen, tipo) {

    pathImagen = path.resolve(__dirname, `../../img/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;
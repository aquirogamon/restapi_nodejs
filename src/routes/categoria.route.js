const express = require('express');
let { verificationToken, verficationAdminRoles } = require('../middlewares/autenticacion');
let app = express();

let Categoria = require('../model/categoria');

// Mostrar todas las categorias
app.get('/categoria', verificationToken, (req, res) => {
    let skip = req.query.skip || 0;
    skip = Number(skip);

    let limit = req.query.limit || 0;
    limit = Number(limit);

    Categoria.find()
        .skip(skip)
        .limit(limit)
        .sort('descripcion')
        .populate('usuario', 'email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments((err, count) => {
                res.json({
                    ok: true,
                    categorias,
                    count
                });
            });
        });
});

// Mostrar una categoria
app.get('/categoria/:id', verificationToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate('usuario', 'email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria
            });
        });
});

// Crear una nueva categoría
app.post('/categoria', [verificationToken, verficationAdminRoles], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

// Actualizar una categoria
app.put('/categoria/:id', [verificationToken, verficationAdminRoles], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descripcionCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descripcionCategoria, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

// Mostrar todas las categorias
app.delete('/categoria/:id', [verificationToken, verficationAdminRoles], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

module.exports = app;
const express = require('express');
let { verificationToken } = require('../middlewares/autenticacion');
let app = express();

let Producto = require('../model/producto');

app.get('/producto', verificationToken, (req, res) => {
    //Trae todos los productos
    // populate: usuario y categoria
    // paginado
    let skip = req.query.skip || 0;
    skip = Number(skip);

    let limit = req.query.limit || 0;
    limit = Number(limit);

    Producto.find({ disponible: true })
        .skip(skip)
        .limit(limit)
        .populate('usuario', 'email role')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({ disponible: true }, (err, count) => {
                res.json({
                    ok: true,
                    productos,
                    count
                });
            });
        });
});

app.get('/producto/:id', verificationToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'email role')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            });
        });
});

// Buscar Productos
app.get('/producto/buscar/:termino', verificationToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

app.post('/producto', verificationToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto
        });
    });
});

app.put('/producto/:id', verificationToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let productoActualizado = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible
    };

    Producto.findByIdAndUpdate(id, productoActualizado, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto
        });
    });
});

app.delete('/producto/:id', verificationToken, (req, res) => {
    let id = req.params.id;
    //Usuario.findByIdAndRemove(id, (err, usuario) => {
    let changestate = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, changestate, { new: true }, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto
        });
    });
});

module.exports = app;
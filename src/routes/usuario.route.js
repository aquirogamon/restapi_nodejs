const express = require('express');
const Usuario = require('../model/usuario.js');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificationToken, verficationAdminRoles } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', [verificationToken, verficationAdminRoles], function(req, res) {
    let skip = req.query.skip || 0;
    skip = Number(skip);

    let limit = req.query.limit || 0;
    limit = Number(limit);

    Usuario.find({ state: true }, 'name lastname username email role state google img')
        .skip(skip)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ state: true }, (err, count) => {
                res.json({
                    ok: true,
                    usuarios,
                    count
                });
            });
        });
});

app.post('/usuario', [verificationToken, verficationAdminRoles], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        username: body.username,
        name: body.name,
        lastname: body.lastname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 12),
        role: body.role
    });

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario
        });
    });
});

app.put('/usuario/:id', [verificationToken, verficationAdminRoles], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['username', 'name', 'lastname', 'email', 'img', 'role', 'state']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario
        });
    });
});

app.delete('/usuario/:id', [verificationToken, verficationAdminRoles], function(req, res) {
    let id = req.params.id;
    //Usuario.findByIdAndRemove(id, (err, usuario) => {
    let changestate = {
        state: false
    };
    Usuario.findByIdAndUpdate(id, changestate, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario
        });
    });
});

module.exports = app;
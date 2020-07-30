const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let roleValidates = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un ROL válido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'El usuario es necesario'],
    },
    name: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    lastname: {
        type: String,
        required: [true, 'El apellido es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'La cuenta de correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roleValidates
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

usuarioSchema.methods.toJSON = function() {
    let usuarioDB = this;
    let usuarioObject = usuarioDB.toObject();
    delete usuarioObject.password;
    return usuarioObject;
};

module.exports = mongoose.model('Usuario', usuarioSchema);
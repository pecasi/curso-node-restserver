const {Schema, model} = require('mongoose');
const Role = require('../models/role');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,   
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']    
    },
    img: {
        type: String,   
    },
    rol: {
        type: String,   
        required: true,
        default: 'USER_ROL',
        enum: Role.schema.path('rol').enumValues
    },
    estado: {
        type: Boolean,   
        default: true
    },  
    google: {
        type: Boolean,   
        default: false
    } 
}); 

UsuarioSchema.methods.toJSON = function() {
    const { __v, _id, password, ...usuario } = this.toObject();
    usuario.uid = _id;  
    return usuario;
}       

module.exports = model( 'Usuario', UsuarioSchema );
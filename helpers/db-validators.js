const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async( rol = '' ) => {
    const existeRol = await Role.findOne( { rol } );     
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }
}

const emailExiste = async( email = '', id = null) => {
    const existeEmail = (!id) ? await Usuario.findOne( { email } ) : await Usuario.findOne({ email, _id: { $ne: id } });
    if ( existeEmail ) {
        throw new Error(`El correo ${ email } ya está registrado`);
    }       
}

const idUsuarioExiste = async( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El id ${ id } no existe`);
    }
}

const usuarioInactivo = async( id ) => {
    const existeUsuario = await Usuario.findById( id ); 
    if ( existeUsuario && !existeUsuario.estado ) {
        throw new Error(`El usuario con id ${ id } está inactivo`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    idUsuarioExiste,
    usuarioInactivo 
};
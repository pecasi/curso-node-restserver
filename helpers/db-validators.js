const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');
const { isValidObjectId } = require('mongoose');

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

const idUsuarioConDependencias = async( id ) => {
    const existeUsuarioProducto = await Producto.findOne( { usuario: id } );  
    const existeUsuarioCategoria = await Categoria.findOne( { usuario: id } );  

    if ( existeUsuarioCategoria  ) {
        throw new Error(`El usuario con id ${ id } tiene categorías asociadas, no se puede eliminar`);
    }  

    if ( existeUsuarioProducto  ) {
        throw new Error(`El usuario con id ${ id } tiene productos asociados, no se puede eliminar`);
    }
}

const idCategoriaExiste = async( id ) => {
    if (!isValidObjectId(id)) {
        return;
    }
    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria  ) {
        throw new Error(`El id ${ id } no existe`);
    }
}

const idCategoriaconDependencias = async( id ) => {
    const existeCategoria = await Producto.findOne( { categoria: id } );    
    if ( existeCategoria  ) {
        throw new Error(`La categoría con id ${ id } tiene productos asociados, no se puede eliminar`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    idUsuarioExiste,
    usuarioInactivo,
    idCategoriaExiste,
    idCategoriaconDependencias,
    idUsuarioConDependencias 
};
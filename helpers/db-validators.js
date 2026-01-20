const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');
const { isValidObjectId } = require('mongoose');

const esRolValido = async( rol = '' ) => {
    const existeRol = await Role.findOne( { rol } );     
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }

    return true;
}

const emailExiste = async( email = '', id = null) => {
    const existeEmail = (!id) ? await Usuario.findOne( { email } ) : await Usuario.findOne({ email, _id: { $ne: id } });
    if ( existeEmail ) {
        throw new Error(`El correo ${ email } ya está registrado`);
    }     
    
    return true;
}

const idUsuarioExiste = async( id ) => {
    if (!isValidObjectId(id)) {
        return true;
    }

    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El id ${ id } no existe`);
    }
    return true;
}

const usuarioInactivo = async( id ) => {
    const existeUsuario = await Usuario.findById( id ); 
    if ( existeUsuario && !existeUsuario.estado ) {
        throw new Error(`El usuario con id ${ id } está inactivo`);
    }

    return true;
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

    return true;
}

const idCategoriaExiste = async( id ) => {
    if (!isValidObjectId(id)) {
        return true;
    }

    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria  ) {
        throw new Error(`El id ${ id } no existe`);
    }

    return true;
}

const idCategoriaconDependencias = async( id ) => {
    const existeCategoria = await Producto.findOne( { categoria: id } );    
    if ( existeCategoria  ) {
        throw new Error(`La categoría con id ${ id } tiene productos asociados, no se puede eliminar`);
    }

    return true;
}

const idCategoriaValido = async( id ) => { 
    if (typeof id === 'object' && id.hasOwnProperty('$oid')) {
        id = id.$oid;
    }   

    if (!isValidObjectId(id)) {
        throw new Error(`El id ${ id } no es válido`);
    }

    return true;
}

const idProductoExiste = async( id ) => {
    if (!isValidObjectId(id)) {
        return true;
    }
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto  ) {
        throw new Error(`El id ${ id } no existe`);
    }

    return true;
}

//Validadores para las colecciones permitidas
const IscoleccionesPermitida = async (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion); 
    
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida - ${colecciones}`);
    }

    return true;
}

//Validar Id Colección
const idColeccionValida = async( id, coleccion, colecciones = [] ) => {
    if (!colecciones.includes(coleccion)) {
       return true;
    }

    switch (coleccion) {
        case 'usuarios':
            await idUsuarioExiste(id);
            break;
        case 'categorias':
            await idCategoriaExiste(id);
            break;
        case 'productos':
            await idProductoExiste(id);
            break;
        default:
            throw new Error(`La colección ${coleccion} no es válida`);  
    }

    return true;
}


module.exports = {
    esRolValido,
    emailExiste,
    idUsuarioExiste,
    usuarioInactivo,
    idCategoriaExiste,
    idCategoriaconDependencias,
    idCategoriaValido,
    idUsuarioConDependencias,
    idProductoExiste,
    IscoleccionesPermitida,
    idColeccionValida 
};
const {response, request} = require('express');
const { ObjectId } = require('mongoose').Types;

const { 
    Producto,
    Categoria,
    Role,
    Usuario,
} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarRoles = async( termino = '', res = response ) => {   
    const esMongoID =  ObjectId.isValid( termino );   

    if ( esMongoID ) {
        const rol = await Role.findById( termino );
        return res.json({   
            results: ( rol ) ? [ rol ] : []
        });
    }
    
    const regex = new RegExp( termino, 'i' );   
    const roles = await Role.find({ rol: regex });
    
    res.json({
        numregs: (roles) ? roles.length : 0,
        results: roles
    });
};

const buscarUsuarios = async( termino = '', res = response ) => {
    const esMongoID =  ObjectId.isValid( termino );   
    
    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            numregs: ( usuario ) ? usuario.length: 0,
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    if (termino.toLowerCase() === 'true' || termino.toLowerCase() === 'false') {
        const terminoBool = (termino.toLowerCase() === 'true');
        const usuarios = await Usuario.find({ 
            $or: [ { estado: terminoBool }, { google: terminoBool } ] 
        });    
        return res.json({
            numregs: ( usuarios ) ? usuarios.length : 0,
            results: (usuarios) ? usuarios : []
        });
    }

    if ( /^\d+$/.test( termino ) ) {
        const usuarios = await Usuario.find({ 
            $or: [ { edad: Number( termino ) } ]    
        });
        return res.json({
            numregs: ( usuarios ) ? usuarios.length : 0,
            results: (usuarios) ? usuarios : []
        });
    }

    const regex = new RegExp( termino, 'i' );   
    
    const usuarios = await Usuario.find({
        $or: [ { nombre: regex }, { correo: regex }, { rol: regex } ],
        //$and: [ { estado: true } ]
    });

    res.json({
        numregs: ( usuarios ) ? usuarios.length : 0,
        results: usuarios
    });
};

const buscarCategorias = async( termino = '', res = response ) => {     
    const esMongoID =  ObjectId.isValid( termino );

    if ( esMongoID ) {
        const categoria = await Categoria
            .find({ $or: [ 
                { _id: termino }, 
                { usuario: new ObjectId(termino) } 
            ]} 
        );
        return res.json({
            numregs: ( categoria ) ? categoria.length : 0,
            results: ( categoria ) ? [ categoria ] : []
        });
    }           
    
    if (termino.toLowerCase() === 'true' || termino.toLowerCase() === 'false') {
        const terminoBool = (termino.toLowerCase() === 'true');
        const categorias = await Categoria.find({ estado: terminoBool });
        return res.json({
            numregs: ( categorias ) ? categorias.length : 0,
            results: (categorias) ? categorias : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre: regex });
    
    res.json({
        numregs: ( categorias ) ? categorias.length : 0,
        results: categorias
    });
};

const buscarProductos = async( termino = '', res = response ) => {    
    const esMongoID =  ObjectId.isValid( termino );
    
    if ( esMongoID ) {
        const producto = await Producto
            .find({ $or: [ 
                { _id: termino }, 
                { categoria: new ObjectId(termino) },
                { usuario: new ObjectId(termino) } 
            ]} ) 
            .populate('usuario', 'nombre email')   
            .populate('categoria', 'nombre');
        return res.json({
            numregs: ( producto ) ? producto.length : 0,
            results: ( producto ) ? [ producto ] : []
        });
    }   

    if (termino.toLowerCase() === 'true' || termino.toLowerCase() === 'false') {
        const terminoBool = (termino.toLowerCase() === 'true');
        const productos = await Producto.find({
            $or: [ { estado: terminoBool }, { disponible: terminoBool } ]});
        return res.json({
            numregs: ( productos ) ? productos.length : 0,
            results: (productos) ? productos : []
        });
    }

    if ( /^\d+$/.test( termino ) ) {
        const productos = await Producto.find({ 
            $or: [ { precio: Number( termino ) } ]  
        })
        .populate('usuario', 'nombre email')   
        .populate('categoria', 'nombre');;
        return res.json({
            numregs: ( productos ) ? productos.length : 0,
            results: (productos) ? productos : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({ 
        $or: [ 
            { nombre: regex }, 
            { descripcion: regex } 
        ] 
    })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre');
    res.json({
        numregs: ( productos ) ? productos.length : 0,
        results: productos
    });
};

const buscar = ( req = request, res = response ) => {
    const { coleccion, termino } = req.params;  

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }       
    
    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuarios( termino, res ); 
        break;  
        case 'categorias':
            buscarCategorias( termino, res ); 
        break;
        case 'productos':
            buscarProductos( termino, res );
        break;
        case 'roles':
            buscarRoles( termino, res );
        break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            });
    }
};

module.exports = {
    buscar
};  
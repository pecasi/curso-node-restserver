const { response, request } = require( 'express' );
const { Producto } = require('../models');

const getProductos = async( req = request, res = response ) => {
    const { limite = 5, desde = 0, activo = null } = req.query;
    const query = (activo === 'true')  ? { estado: true } : (activo === 'false') ? { estado: false } : {};      
    
    const [ totalRegsBD, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .skip( Number( desde ) )        
            .limit( Number( limite ) )
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
    ]); 

    res.json({
        total: productos.length,
        totalRegsBD,
        productos
    });
};

const getProductoById = async( req = request, res = response ) => {
    const { id } = req.params;
    
    const [ producto ] = await Promise.all([
        Producto.findById( id )
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')    
    ]);

    res.json({
        producto
    });
};

const createProducto = async( req = request, res = response ) => {
    const { estado, usuario, ...body } = req.body;

    if (body.nombre) {
        body.nombre = body.nombre.toUpperCase();
    }
    
    const productoDB = await Producto.findOne( { nombre: body.nombre } );    
    
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }       
    
    const data = {
        ...body,     
        usuario: req.usuario._id    
    };
    
    const producto = new Producto( data );    
    await producto.save();
    await Producto.populate( producto, { path: 'usuario', select: 'nombre email' } );          
    await Producto.populate( producto, { path: 'categoria', select: 'nombre' } );       
    
    res.status(201).json({
        producto
    });
}

const updateProducto = async( req = request, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body; 

    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }   
    
    data.usuario = req.usuario._id;
    
    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre');       
    
        res.json({
        producto
    });
};

const deleteProductoLogic = async( req = request, res = response ) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true } )
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre');       
    
        res.json({
        producto
    });
}

const deleteProducto = async( req = request, res = response ) => {
    const { id } = req.params; 
    const [ productoDelete, producto ] = await Promise.all([
        Producto.findByIdAndDelete( id ),
        Producto.findById( id )
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')       
    ]); 
    res.json({
        producto
    });
}; 

module.exports = {
    getProductos,
    getProductoById,        
    createProducto,
    updateProducto,
    deleteProductoLogic,
    deleteProducto
};
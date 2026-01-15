const { response, request } = require('express');
const { Categoria } = require('../models');
const categoria = require('../models/categoria');

const getCategorias = async (req = request, res = response) => {
    // Lógica para obtener categorías
    const {limite = 5, desde = 0, activo = null} = req.query;   
    const query = (activo === 'true')  ? { estado: true } : (activo === 'false') ? { estado: false } : {};  

    const [ totalRegsBD, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
            .populate('usuario', 'nombre email')
    ]);     

    res.json({
        total: categorias.length,
        totalRegsBD,
        categorias
    });
};                  

const getCategoriaById = async (req = request, res = response) => {
    const { id } = req.params;
    
    const [ categoria ] =  await Promise.all([ 
        Categoria.findById( id ).populate('usuario', 'nombre email')
    ]);
    
    res.json({
        categoria
    });
};

const createCategoria = async (req = request, res = response) => {
    // Lógica para crear una categoría

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre}, ya existe`
        });
    }
    const data = {
        nombre,
        usuario: req.usuario._id
    };
    
    const categoria = new Categoria(data);
    await categoria.save();
    await Categoria.populate( categoria, { path: 'usuario', select: 'nombre email' } );          

    res.json({
        categoria
    });
};

const updateCategoria = async (req = request, res = response) => {  
    const { id } = req.params;

    const { esto, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    
    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } ).populate('usuario', 'nombre email');

    res.json({
        categoria
    });
};

const deleteCategoriaLogic = async (req = request, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true } ).populate('usuario', 'nombre email');

    res.json({
        categoria
    });
};

const deleteCategoria = async (req = request, res = response) => {
    const { id } = req.params;

    const [ categoriaDelete, categoria ] = await Promise.all([
        Categoria.findByIdAndDelete( id ),
        Categoria.findById( id ).populate('usuario', 'nombre email')
    ]);

    res.json({
        categoria
    });
};

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoriaLogic,
    deleteCategoria
};  
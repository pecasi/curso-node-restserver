const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const usuario = require('../models/usuario');

const getUser = async (req = request, res = response) => {
    const {limite = 5, desde = 0, activo = null} = req.query;   
    const query = (activo === 'true')  ? { estado: true } : (activo === 'false') ? { estado: false } : {};  

    const [ totalRegsBD, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) ),
    ]); 

    res.json({
        total: usuarios.length,
        totalRegsBD,
        usuarios
    });
};

const createUser = async(req = request, res = response) => {
    const { nombre, email, password, rol } = req.body;
    const usuario = new Usuario( { nombre, email, password, rol } );

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // guardar en la base de datos
    await usuario.save();

    res.json({
        usuario
    });

};

const updateUser = async (req = request, res = response) => {
    const { id } = req.params;
    const {_id, password, google,email, ...resto } = req.body;

    if ( password ) {   
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const [updateUsuario, usuario] = await Promise.all([
        Usuario.findByIdAndUpdate( id, resto ),
        Usuario.findById( id )
    ]);

    res.json({
        usuario
    });
};
 //Borrar usuario de forma lógica
const deleteUserLogic = async (req = request, res = response) => {
    const { id } = req.params;

    const [updateUsuario, usuario] = await Promise.all([
        Usuario.findByIdAndUpdate( id, { estado: false } ),
        Usuario.findById( id )
    ]);

    res.json({
        msg: `User DELETE LOGIC endpoint for user with id: ${id}`,
        usuario
    });
};

 //Borrar usuario de forma lógica
const deleteUser = async (req = request, res = response) => {
    const { id } = req.params;

    const [deleteUsuario, usuario] = await Promise.all([
        Usuario.findByIdAndDelete( id ),
        Usuario.findById( id )
    ]);

    res.json({
        msg: `User DELETE endpoint for user with id: ${id}`,
        usuario
    });
};

const patchUser = (req = request, res = response) => {
    const { id } = req.params;
    res.json({
        msg: `User PATCH endpoint for user with id: ${id}`
    });
};

module.exports = {
    getUser,
    createUser, 
    updateUser,
    deleteUserLogic,
    deleteUser,
    patchUser
};  
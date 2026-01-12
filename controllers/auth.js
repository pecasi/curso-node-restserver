const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt-generate');

const login = async(req = request, res = response) => {
    const { email, password } = req.body;
    
    try {
        //Verificar si email existe
        const usuario = await Usuario.findOne( { email } );
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }

        //verificar si el usuario esta activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }   

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Generar el JWT
        const token = await generateJWT( usuario.id );        

        res.json({
            usuario,
            token
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   
}

module.exports = {
    login
}
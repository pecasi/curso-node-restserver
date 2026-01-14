const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt-generate');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;  
    try {        
        const { name, picture, email } = await googleVerify(id_token);

        //Verificar si el usuario existe
        let usuario = await Usuario.findOne( { email } );

        if ( !usuario ) {                   
            //Crear usuario
            const data = {
                nombre: name,
                email,
                password: ':P',
                img: picture,
                google: true
            };
            usuario = new Usuario( data );
            await usuario.save();
        }
        //Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            });
        }   

        //Generar el JWT
        const token = await generateJWT( usuario.id );

        res.json({
            msg: 'Google Sign-In OK',
            token,
            id_token,
            usuario
        });
    }       
    catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: 'Hable con el administrador - El token no se pudo verificar',
            error: error
        });
    }   
}       

module.exports = {
    login,
    googleSignIn
}
const  jwt = require('jsonwebtoken');
const { response, request } = require('express');
const Usuario = require('../models/usuario');


const validateJWT = async(req = request, res = response , next) => {
    const token = req.header('x-token');

    // Middleware logic to validate JWT
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }   

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );  
        const usuario = await Usuario.findById(uid);  

        //Verificar si el usuario existe
        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en BD'
            });
        }

        //Verificar si el usuario está activo
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado en false en BD'
            });
        }

        req.usuario = usuario;

        next(); 
    } catch (error) {
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validateJWT
}
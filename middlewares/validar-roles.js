const { response, request } = require('express');

const esAsdminRol = (req = request, res = response, next) => {  
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROL' ) {  
        return res.status(403).json({
            msg: `${ nombre } no es administrador - No puede hacer esto`
        });
    } 

    next();
}

const tieneRol = ( ...roles ) => {  
    return (req = request, res = response, next) => {
        if ( !req.usuario ) {   
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }
        
         const { rol, nombre } = req.usuario;
        
        if ( !roles.includes( rol ) ) {
            return res.status(403).json({
                msg: `El servicio requiere un usuario con uno de estos roles ${ roles } - El usuario logado es: ${ nombre } con rol ${ rol }`
            });
        }
        next();
    }
}


module.exports = {
    esAsdminRol,
    tieneRol
}
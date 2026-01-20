const { response, request } = require('express');

const esColeccionPermitida = (colecciones = []) => {  
    return (req = request, res = response, next) => {
        const { coleccion } = req.params;
        const incluida = colecciones.includes(coleccion);
        
        if (!incluida) {
            return res.status(400).json({
                msg: `La colección ${coleccion} no es permitida - ${colecciones}`
            });
        }
        return next();
    }
};

module.exports = {
    esColeccionPermitida
};   
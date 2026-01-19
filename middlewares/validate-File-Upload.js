const { response, request } = require('express');
const { 
    getNombreCortado, 
    getExtensionArchivo, 
    isExtensionValid 
} = require('../helpers/upload-validators');

const validateFileExtension = (req = request, res = response, next) => {    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }
    const { archivo } = req.files;

    let nombreCortado;
    let extensionArchivo;
    const extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ];

    if ( Array.isArray(archivo) ) {
        let mensajes = [];

        archivo.forEach(elemento => {
            nombreCortado = getNombreCortado( elemento.name );   
            extensionArchivo = getExtensionArchivo( nombreCortado );

            // Validar extension
            if ( !isExtensionValid( extensionArchivo, extensionesValidas ) ) {
                mensajes.push({message: `The extension ${ extensionArchivo } is not allowed - ${ extensionesValidas } - file: ${ elemento.name }`});
            }
        });

        if ( mensajes.length > 0 ) {
            return res.status(400).json({ 
                messages: mensajes
            });
        }   

        return next();
    }
    else {
        nombreCortado = getNombreCortado( archivo.name );
        extensionArchivo = getExtensionArchivo( nombreCortado ); 

        // Validar extension
        if ( !isExtensionValid( extensionArchivo, extensionesValidas ) ) {
            return res.status(400).json({ 
                message: `The extension ${ extensionArchivo } is not allowed - ${ extensionesValidas } - file: ${ archivo.name }`
            });
        }   
        next();
    }
};

module.exports = {
    validateFileExtension
};  
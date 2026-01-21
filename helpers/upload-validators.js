const { cp } = require('fs');
const path = require('path');

const getUploadPath = ( fileName, rutaOrigen = '' ,carpeta = '' ) => {
    return path.join(__dirname, rutaOrigen, carpeta, fileName);
}

const moveFile = ( fichero, destino ) => {
    try {
        fichero.mv( destino );
        return true;
    }
    catch (error) {
        throw new Error( error );
    }
}

const getNombreCortado = ( fileName ) => {
    return fileName.split('.');
}

const getExtensionArchivo = ( nombreCortado ) => {
    return nombreCortado[ nombreCortado.length - 1 ]; 
}

const isExtensionValid = ( extensionArchivo, extensionesValidas) => {
    let esValida = false;

    if ( Array.isArray( extensionesValidas ) ) {
        if (extensionesValidas.includes(extensionArchivo)) {
            esValida = true;
        }
    }

    return esValida;
}

const isArrayFileParameter = ( obj, checkArray = true ) => {  
    if ( checkArray ) {
        if (!Array.isArray( obj )){
            throw new Error('The file parameter must be an array');
        }
    }
    else {
        if (Array.isArray( obj )) {
            throw new Error('The file parameter must not be an array');
        }
    }

    return true
};

module.exports = {      
    getUploadPath,
    moveFile,
    getNombreCortado,
    getExtensionArchivo,
    isArrayFileParameter,
    isExtensionValid,
};
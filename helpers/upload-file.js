const { v4: uuidv4 } = require('uuid');
const { 
    moveFile, 
    getUpaloadPath, 
    getNombreCortado, 
    getExtensionArchivo 
} = require('../helpers/upload-validators');

const subirArchivo = (archivo, carpeta = '') => {
    let mensajes = [];
    let uploadPath;
    let nombreCortado;
    let extension;
    let nombreArchivoTemp;

    if ( Array.isArray(archivo) ) {
        archivo.forEach(elemento => {
            nombreCortado = getNombreCortado( elemento.name );
            extension = getExtensionArchivo( nombreCortado );
            nombreArchivoTemp = `${ uuidv4() }.${ extension }`;

            uploadPath = getUpaloadPath( nombreArchivoTemp, carpeta );    
            
            if (moveFile( elemento, uploadPath )) {
                mensajes.push({ 
                    nombre: nombreArchivoTemp,
                    path: uploadPath
                 });
            }
        });

        return mensajes;
    } 
    else {
        nombreCortado = getNombreCortado( archivo.name );
        extension = getExtensionArchivo( nombreCortado);
        nombreArchivoTemp = `${ uuidv4() }.${ extension }`;

        uploadPath = getUpaloadPath( nombreArchivoTemp, carpeta );

        if (moveFile( archivo, uploadPath )) {
            return { 
                nombre: nombreArchivoTemp,
                path: uploadPath 
            };
        }
    }
};

module.exports = {
    subirArchivo
};
const { v4: uuidv4 } = require('uuid');
const { 
    moveFile, 
    getUploadPath, 
    getNombreCortado, 
    getExtensionArchivo 
} = require('../helpers/upload-validators');

const subirArchivo = async (archivo, rutaOrigen = '', carpeta = '') => {
    let mensajes = [];
    let uploadPath;
    let nombreCortado;
    let extension;
    let nombreArchivoTemp;

    if ( Array.isArray(archivo) ) {
        archivo.forEach(async elemento => {
            nombreCortado = getNombreCortado( elemento.name );
            extension = getExtensionArchivo( nombreCortado );
            nombreArchivoTemp = `${ uuidv4() }.${ extension }`;

            uploadPath = getUploadPath( nombreArchivoTemp, rutaOrigen, carpeta );    
           
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

        uploadPath = getUploadPath( nombreArchivoTemp, rutaOrigen, carpeta );

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
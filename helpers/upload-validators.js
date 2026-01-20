const path = require('path');

const getUpaloadPath = ( fileName, carpeta = '' ) => {
    return path.join(__dirname, '../upload/', carpeta, fileName);
}

const moveFile = ( fichero, destino ) => {
    return new Promise( (resolve, reject) => {
        fichero.mv( destino, (err) => { 
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(
                destino
            );
        });
    });
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

module.exports = {      
    getUpaloadPath,
    moveFile,
    getNombreCortado,
    getExtensionArchivo,
    isExtensionValid    
};
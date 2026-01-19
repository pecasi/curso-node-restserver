const path = require('path');

const getUpaloadPath = ( fileName ) => {
    return path.join(__dirname, '../upload/', fileName);
}

const moveFile = ( fichero, destino ) => {
    return new Promise( (resolve, reject) => {
        fichero.mv( destino, (err) => { 
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(
                true
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

const isExtensionValid = ( extensionArchivo, extensionesValidas ) => {
    return extensionesValidas.includes( extensionArchivo );
}

module.exports = {      
    getUpaloadPath,
    moveFile,
    getNombreCortado,
    getExtensionArchivo,
    isExtensionValid    
};
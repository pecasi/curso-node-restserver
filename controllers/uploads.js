const { request, response } = require('express');  
const fs = require('fs');
const { 
    getUpaloadPath,
    moveFile
} = require(`../helpers/upload-validators`);

const cargarArchivo = (req = request, res = response) => {  
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const { archivo } = req.files;

    let mensajes = [];
    let uploadPath;

    if ( Array.isArray(archivo) ) {
        archivo.forEach(elemento => {
            uploadPath = getUpaloadPath( elemento.name );    
            
            if (moveFile( elemento, uploadPath )) {
                mensajes.push({ message: `File uploaded to ${uploadPath}` });
            }
        });

        res.json({ messages: mensajes });
    } 
    else {
        uploadPath = getUpaloadPath( archivo.name );

        if (moveFile( archivo, uploadPath )) {
            res.json({ message: `File uploaded to ${uploadPath}` });
        }
    }
};

module.exports = {      
    cargarArchivo
};




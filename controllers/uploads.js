const { request, response } = require('express');  
const { subirArchivo } = require(`../helpers`);
const { Usuario, Producto } = require('../models');
const fs = require('fs');
const { getUploadPath } = require('../helpers/upload-validators');
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const cargarArchivo = (rutaOrigen = '', carpeta = '') => {
    return async(req = request, res = response) => {  
        try {
            const { archivo } = req.files;
            const result = await subirArchivo( archivo, rutaOrigen, carpeta );
            res.json(result);
        }  
        catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: `Hable con el administrador - ${ error }`
            });
        };
    }
};

const updateFile = (rutaOrigen = '') => {
    return async(req = request, res = response) => { 
        // Lógica para actualizar un archivo
        try {
            const { coleccion, id } = req.params;
            const { archivo } = req.files;

            let modelo;
            switch (coleccion) {
                case 'usuarios':
                    modelo =  await Usuario.findById( id );

                    if ( !modelo ) {
                        return res.status(400).json({
                            msg: `No existe un usuario con el id ${ id }`
                        });
                    }   

                    break;
                case 'productos':
                    modelo = await Producto.findById( id );

                    if ( !modelo ) {
                        return res.status(400).json({
                            msg: `No existe un producto con el id ${ id }`
                        });
                    }   

                    break;
                default:
                    return res.status(500).json({ msg: 'Se me olvidó validar esto' });
            }

            // Limpiar imágenes previas
            if ( modelo.img ) {
                const pathImagen =  getUploadPath( modelo.img, rutaOrigen, coleccion );
                if ( fs.existsSync( pathImagen )) {
                    fs.unlinkSync( pathImagen );
                }
            }

            const result = await subirArchivo( archivo, rutaOrigen, coleccion );

            modelo.img = result.nombre;
            await modelo.save();

            res.json({id, coleccion, result});
        }  
        catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: `Hable con el administrador - ${ error }`
            });
        }
    }
};

const updateFileCloudinary = (rutaOrigen = '') => {
    return async(req = request, res = response) => { 
        // Lógica para actualizar un archivo
        try {
            const { coleccion, id } = req.params;
            const { archivo } = req.files;

            let modelo;
            switch (coleccion) {
                case 'usuarios':
                    modelo =  await Usuario.findById( id );

                    if ( !modelo ) {
                        return res.status(400).json({
                            msg: `No existe un usuario con el id ${ id }`
                        });
                    }   

                    break;
                case 'productos':
                    modelo = await Producto.findById( id );

                    if ( !modelo ) {
                        return res.status(400).json({
                            msg: `No existe un producto con el id ${ id }`
                        });
                    }   

                    break;
                default:
                    return res.status(500).json({ msg: 'Se me olvidó validar esto' });
            }

            // Limpiar imágenes previas
            if ( modelo.img ) {
               const nombreArr = modelo.img.split('/');
               const nombre = nombreArr[ nombreArr.length - 1 ];
               const [ public_id ] = nombre.split('.');
               await cloudinary.uploader.destroy(public_id);    
            }
            
            const { tempFilePath } = archivo;
            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

            modelo.img = secure_url;
            await modelo.save();

            res.json({id, coleccion, modelo});
        }  
        catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: `Hable con el administrador - ${ error }`
            });
        }
    }
};

const getFile = (rutaOrigen = '') => {
    return async(req = request, res = response) => { 
        const { coleccion, id } = req.params;
        let modelo;

        switch (coleccion) {
            case 'usuarios':
                modelo =  await Usuario.findById( id ); 

                if ( !modelo ) {
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${ id }`
                    });
                }
                break;
            case 'productos':
                modelo = await Producto.findById( id );
                
                if ( !modelo ) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                    });
                }   
                break;
            default:
                return res.status(500).json({ msg: 'Se me olvidó validar esto' });
        }   

        // Verificar si el modelo tiene una imagen
        if ( modelo.img ) {
            const pathImagen =  getUploadPath( modelo.img, rutaOrigen, coleccion );
            if (fs.existsSync( pathImagen )) {
                return res.sendFile( pathImagen );
            }
        }

        const pathNoImagen = getUploadPath( 'no-image.jpg', '../assets', '' );;
        return res.sendFile( pathNoImagen );
    }
}

const getFileCloudinary = async(req = request, res = response) => { 
    const { coleccion, id } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo =  await Usuario.findById( id ); 

            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }   
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }   

    // Verificar si el modelo tiene una imagen
    if ( modelo.img ) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        const url = cloudinary.url( public_id, {
            width: 250,
            height: 250,
            Crop: 'fill'
        });
        return res.redirect( url );
    }

    const pathNoImagen = getUploadPath( 'no-image.jpg', '../assets', '' );;
    return res.sendFile( pathNoImagen );
}   

module.exports = {      
    cargarArchivo,
    getFile,
    getFileCloudinary, 
    updateFile,
    updateFileCloudinary 
};
const { request, response } = require('express');  
const { subirArchivo } = require(`../helpers`);
const { Usuario, Producto } = require('../models');

const cargarArchivo = (carpeta = '') => {
    return async(req = request, res = response) => {  
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        } 

        try {
            const { archivo } = req.files;
            const result = await subirArchivo( archivo, carpeta );

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

const updateFile = async (req = request, res = response) => {
    // Lógica para actualizar un archivo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
            return res.status(400).json({ message: 'No files were uploaded.' });
    } 
    
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

        const result = await subirArchivo( archivo, coleccion );

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

};

module.exports = {      
    cargarArchivo,
    updateFile  
};
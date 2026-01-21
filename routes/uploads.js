const { Router } = require('express');
const { check} = require('express-validator');

const { 
    isExistsFiletoUpload,
    esColeccionPermitida,
    validarCampos,    
    validateFileExtension,
    validateJWT
} = require('../middlewares');

const { 
    cargarArchivo, 
    getFile,
    getFileCloudinary,
    updateFile,
    updateFileCloudinary
} = require('../controllers/uploads');

const { 
    idColeccionValida,
    isArrayFileParameter
} = require('../helpers');

const router = Router();

let extensionesPermitidas = [];
let coleccionesPermitidas = [];

extensionesPermitidas = [ 'png', 'jpg', 'jpeg', 'gif' ];
router.post('/',
[
    validateJWT,
    isExistsFiletoUpload,
    check('archivo').custom( ( value, { req } ) => isArrayFileParameter( req.files.archivo, false ) ),
    validateFileExtension(extensionesPermitidas),
    validarCampos
], 
cargarArchivo('../upload','imagenes'));

extensionesPermitidas = [ 'png', 'jpg', 'jpeg', 'gif' ];
router.post('/multiple',
[
    validateJWT,
    isExistsFiletoUpload,
    check('archivo').custom( ( value, { req } ) => isArrayFileParameter( req.files.archivo ) ),
    validateFileExtension(extensionesPermitidas),
    validarCampos
], 
cargarArchivo('../upload','imagenes'));

coleccionesPermitidas = [ 'usuarios', 'productos' ];
extensionesPermitidas = [ 'png', 'jpg', 'jpeg', 'gif' ];
router.put('/:coleccion/:id',
[
    validateJWT,
    isExistsFiletoUpload,
    check('archivo').custom( ( value, { req } ) => isArrayFileParameter( req.files.archivo, false ) ),
    validateFileExtension(extensionesPermitidas),
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    esColeccionPermitida(coleccionesPermitidas),
    check('id').custom((id, { req }) => idColeccionValida(id, req.params.coleccion, coleccionesPermitidas) ),
    validarCampos
], 
updateFileCloudinary('../upload'));

router.get('/:coleccion/:id',
[
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    esColeccionPermitida(coleccionesPermitidas),
    check('id').custom((id, { req }) => idColeccionValida(id, req.params.coleccion, coleccionesPermitidas) ),
    validarCampos
], 
getFileCloudinary);

module.exports = router;
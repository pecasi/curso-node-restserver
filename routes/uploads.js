const { Router } = require('express');
const { check} = require('express-validator');

const { 
    validarCampos, 
    esColeccionPermitida,
    validateJWT, 
    validateFileExtension
} = require('../middlewares');

const { 
    cargarArchivo, 
    updateFile 
} = require('../controllers/uploads');

const { 
    IscoleccionesPermitida,
    idColeccionValida
} = require('../helpers');

const router = Router();

router.post('/',
[
    validateJWT,
    validateFileExtension(['png', 'jpg', 'jpeg'])
], 
cargarArchivo('imagenes'));

router.post('/multiple',
[
    validateJWT,
    validateFileExtension(['png', 'jpg', 'jpeg', 'gif'])
], 
cargarArchivo('imagenes'));

router.put('/:coleccion/:id',
[
    validateJWT,
    validateFileExtension(['png', 'jpg', 'jpeg', 'gif']),
    check('id', 'El id debe ser de MongoDB').isMongoId(),
    esColeccionPermitida(['usuarios', 'productos']),
    check('id').custom((id, { req }) => idColeccionValida(id, req.params.coleccion, ['usuarios', 'productos']) ),
    validarCampos
], 
updateFile);

module.exports = router;
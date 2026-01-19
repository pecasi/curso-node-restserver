const { Router } = require('express');
const { check} = require('express-validator');
 const { validarCampos, validateJWT, validateFileExtension } = require('../middlewares');

 const router = Router();

const { cargarArchivo } = require('../controllers/uploads');

router.post('/',
[
    validateJWT,
    validateFileExtension
], 
cargarArchivo);

router.post('/multiple',
[
    validateJWT,
// //     upload.array('files', 10),
    validateFileExtension
], 
cargarArchivo);

module.exports = router;
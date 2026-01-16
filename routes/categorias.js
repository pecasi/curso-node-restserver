const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos, 
    validateJWT,
    esAsdminRol,
} = require('../middlewares');

const { 
    getCategorias, 
    getCategoriaById,
    createCategoria, 
    updateCategoria, 
    deleteCategoriaLogic, 
    deleteCategoria 
} = require('../controllers/categorias');

const { 
    idCategoriaExiste,
    idCategoriaconDependencias
 } = require('../helpers/db-validators');

const router = Router();

router.get('/', getCategorias);

router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom ( id => idCategoriaExiste(id) ),
    validarCampos
], getCategoriaById);

router.post('/',[
    validateJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createCategoria);

router.put('/:id',[
    validateJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom ( id => idCategoriaExiste(id) ),
    validarCampos
], updateCategoria);

router.delete('/logic/:id',[    
    validateJWT,
    esAsdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom ( id => idCategoriaExiste(id) ),
    validarCampos
], deleteCategoriaLogic);

router.delete('/:id',[
    validateJWT,
    esAsdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom ( id => idCategoriaExiste(id) ),
    check('id').custom ( id => idCategoriaconDependencias(id) ),
    validarCampos
], deleteCategoria);

module.exports = router;
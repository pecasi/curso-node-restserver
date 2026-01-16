const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos, 
    validateJWT,
    esAsdminRol,
} = require('../middlewares');

const { 
    getProductos, 
    getProductoById,
    createProducto,
    updateProducto, 
    deleteProductoLogic, 
    deleteProducto
} = require('../controllers/productos');

const { 
    idProductoExiste,
    idCategoriaExiste,
 } = require('../helpers/db-validators');

 const router = Router();

router.get('/', getProductos);

router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom ( id => idProductoExiste(id) ),  
    validarCampos
], getProductoById);

router.post('/',[
    validateJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),        
    check('categoria', 'No es un ID valido').isMongoId(),
    check('categoria').custom ( id => idCategoriaExiste(id) ),
    validarCampos
], createProducto);

router.put('/:id',[
    validateJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID valido').isMongoId(),
    check('categoria').custom ( id => idCategoriaExiste(id) ),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom ( id => idProductoExiste(id) ),  
    validarCampos
], updateProducto);     

router.delete('/logic/:id',[    
    validateJWT,
    esAsdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom ( id => idProductoExiste(id) ),  
    validarCampos   
], deleteProductoLogic);

router.delete('/:id',[
    validateJWT,
    esAsdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom ( id => idProductoExiste(id) ),  
    validarCampos   
], deleteProducto); 

module.exports = router;
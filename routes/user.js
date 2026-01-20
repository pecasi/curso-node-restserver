const { Router } = require('express');
const {check} = require('express-validator');
const {
    validarCampos, 
    validateJWT,
    esAsdminRol,
    tieneRol
} = require('../middlewares');

const { 
    esRolValido, 
    emailExiste, 
    idUsuarioExiste, 
    usuarioInactivo, 
    idUsuarioConDependencias 
} = require('../helpers');

const {
    getUser,
    createUser,
    updateUser,
    deleteUserLogic,
    deleteUser,
    patchUser
} = require('../controllers/user'); 

const router = Router();

router.get('/',[
    validateJWT,
    tieneRol('ADMIN_ROL', 'VENTAS_ROL'),
    esAsdminRol,
], getUser);

router.post('/', [
    validateJWT,
    tieneRol('ADMIN_ROL', 'VENTAS_ROL'),
    esAsdminRol,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe de ser mas de 6 letras').isLength( { min: 6 } ),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(( email )=> emailExiste(email) ),
    check('rol').custom( esRolValido),
    validarCampos
], createUser);

router.put('/:id', [
    validateJWT,
    tieneRol('ADMIN_ROL', 'VENTAS_ROL'),
    esAsdminRol,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe de ser mas de 6 letras').isLength( { min: 6 } ),
    check('email', 'El correo no es valido').isEmail(),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( idUsuarioExiste ),
    check('rol').custom( esRolValido),
    check('email').custom( (email, { req }) => emailExiste( email, req.params.id ) ),
    validarCampos
], updateUser);

router.delete('/logic/:id', [
    validateJWT,
    tieneRol('ADMIN_ROL', 'VENTAS_ROL'),
    esAsdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( idUsuarioExiste ),
    check('id').custom( usuarioInactivo ),
    validarCampos
], deleteUserLogic);

router.delete('/:id', [
    validateJWT,
    tieneRol('ADMIN_ROL', 'VENTAS_ROL'),
    esAsdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( idUsuarioExiste ),
    check('id').custom(id => idUsuarioConDependencias(id)),
    validarCampos
], deleteUser);

router.patch('/:id',patchUser);

module.exports = router;
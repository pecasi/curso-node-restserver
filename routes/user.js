const { Router } = require('express');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { 
    esRolValido, 
    emailExiste,
    idUsuarioExiste,
    usuarioInactivo
 } = require('../helpers/db-validators');

const {
    getUser,
    createUser,
    updateUser,
    deleteUserLogic,
    deleteUser,
    patchUser
} = require('../controllers/user'); 

const router = Router();

router.get('/', getUser);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe de ser mas de 6 letras').isLength( { min: 6 } ),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(( email )=> emailExiste(email) ),
    check('rol').custom( esRolValido),
    validarCampos
], createUser);

router.put('/:id', [
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
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( idUsuarioExiste ),
    check('id').custom( usuarioInactivo ),
    validarCampos
], deleteUserLogic);

router.delete('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( idUsuarioExiste ),
    validarCampos
], deleteUser);

router.patch('/:id',patchUser);

module.exports = router;
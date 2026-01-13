const { Router } = require('express');
const {check} = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('email', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google',[
    check('id_token', 'El token de Google es obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router;
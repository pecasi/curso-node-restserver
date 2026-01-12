const validarCampos = require('../middlewares/validar-campos');
const validateJWT = require('../middlewares/validar-JWT'); 
const validateRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validarCampos,
    ...validateJWT,
    ...validateRoles
}
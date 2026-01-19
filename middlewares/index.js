const validarCampos = require('../middlewares/validar-campos');
const validateJWT = require('../middlewares/validar-JWT'); 
const validateRoles = require('../middlewares/validar-roles');
const validateFileUpload = require('../middlewares/validate-File-Upload');

module.exports = {
    ...validarCampos,
    ...validateJWT,
    ...validateRoles,
    ...validateFileUpload
}
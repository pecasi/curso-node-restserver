const dbValidators = require('../helpers/db-validators');
const generarJWT = require('../helpers/jwt-generate');
const googleVerify = require('../helpers/google-verify');
const uploadValidators = require('../helpers/upload-validators');
const uploadFile = require('../helpers/upload-file');

module.exports = {      
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadValidators,
    ...uploadFile
};
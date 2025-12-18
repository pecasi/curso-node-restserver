const   { Router } = require('express');
const {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    patchUser
} = require('../controllers/user'); 

const router = Router();

router.get('/', getUser);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.patch('/:id',patchUser);

module.exports = router;
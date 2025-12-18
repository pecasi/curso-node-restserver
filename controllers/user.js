const { response, request } = require('express');

const getUser = (req = request, res = response) => {
    const { q, nombre = 'No name', apikey, page = 1, limit = 10 } = req.query;

    res.json({
        msg: 'User GET endpoint',
        q,
        nombre,
        apikey,
        page,
        limit
    });
};

const createUser = (req = request, res = response) => {
    const { nombre, edad} = req.body;

    res.json({
        msg: 'User POST endpoint',
        nombre,
        edad
    });

};

const updateUser = (req = request, res = response) => {
    const { id } = req.params;

    res.json({
        msg: `User PUT endpoint for user with id: ${id}`
    });
};

const deleteUser = (req = request, res = response) => {
    const { id } = req.params;
    res.json({
        msg: `User DELETE endpoint for user with id: ${id}`
    });
};

const patchUser = (req = request, res = response) => {
    const { id } = req.params;
    res.json({
        msg: `User PATCH endpoint for user with id: ${id}`
    });
};

module.exports = {
    getUser,
    createUser, 
    updateUser,
    deleteUser,
    patchUser
};  
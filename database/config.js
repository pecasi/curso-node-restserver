const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect( process.env.MOMGODB_CNN, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });
        console.log('DataBase Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD - Hable con el administrador');
    }       
}

module.exports = {
    dbConnection
}
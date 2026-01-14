const express = require('express');
var cors = require('cors')
const { dbConnection } = require('../database/config');

class Server {
    constructor() { 
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/users';
        this.authPath = '/api/auth';

        // Conectar a base de datos
        this.dbConnection();

        // Middlewares
        this.middlewares();

        // Rutas de la aplicacion
        this.routes();
    }

    async dbConnection() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );
        
       // Directorio publico
         this.app.use( express.static('public') );
    }

    routes() {
        // CORS
        this.app.use( cors() );

        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.userPath, require('../routes/user'));
    }           

    listen() {
        // CORS
        this.app.use( cors() );

        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;    
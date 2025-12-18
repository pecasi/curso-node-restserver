const express = require('express');
var cors = require('cors')

class Server {
    constructor() { 
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/users';

        // Middlewares
        this.midelwares();

        // Rutas de la aplicacion
        this.routes();
    }

    midelwares() {
        // CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );
        
       // Dierctorio publico
         this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.userPath, require('../routes/user'));
    }           

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;    
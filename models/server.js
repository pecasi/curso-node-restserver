const express = require('express');
var cors = require('cors')
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
    constructor() { 
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            users: '/api/users',
            uploads: '/api/uploads'
        };

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

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }           

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

module.exports = Server;    
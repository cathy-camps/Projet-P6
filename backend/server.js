const http = require('http');
const app = require('./app');
const dotenv = require('dotenv')

dotenv.config();

//fonction qui renvoit un port valide (que ce soit un numéro ou une chaine)
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//initialisation de la valeur du port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//recherche s'il y a des erreurs et les gère, elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' droits insuffisants.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' est déjà en service.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//écouteur d'évènement consignant le port sur lequel le serveur s'exécute dans la console
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);

console.log('hello world')
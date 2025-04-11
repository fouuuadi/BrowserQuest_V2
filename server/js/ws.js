const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const Utils = require('./utils');
const BISON = require('bison');

let useBison = false;
let WS = {};

// Classe de base Server
class Server {
    constructor(port) {
        this.port = port;
        this._connections = {};
        this._counter = 0;
    }

    onConnect(callback) {
        this.connection_callback = callback;
    }

    onError(callback) {
        this.error_callback = callback;
    }

    broadcast(message) {
        // Diffuse le message à toutes les connexions
        Object.values(this._connections).forEach(connection => connection.send(message));
    }

    forEachConnection(callback) {
        Object.values(this._connections).forEach(callback);
    }

    addConnection(connection) {
        this._connections[connection.id] = connection;
    }

    removeConnection(id) {
        delete this._connections[id];
    }

    getConnection(id) {
        return this._connections[id];
    }
}

// Classe Connection
class Connection {
    constructor(id, connection, server) {
        this._connection = connection;
        this._server = server;
        this.id = id;
    }

    onClose(callback) {
        this.close_callback = callback;
    }

    listen(callback) {
        this.listen_callback = callback;
    }

    send(message) {
        // Envoie un message au client
        let data;
        if (useBison) {
            data = BISON.encode(message);
        } else {
            data = JSON.stringify(message);
        }
        this.sendUTF8(data);
    }

    sendUTF8(data) {
        this._connection.send(data);
    }

    close(logError) {
        console.log(`Closing connection to ${this._connection.remoteAddress}. Error: ${logError}`);
        this._connection.close();
    }
}

// Serveur WebSocket utilisant `ws`
class WebSocketServer extends Server {
    constructor(port) {
        super(port);
        const self = this;

        // Crée un serveur HTTP pour gérer les connexions WebSocket
        this._httpServer = http.createServer((request, response) => {
            const path = url.parse(request.url).pathname;
            switch (path) {
                case '/status':
                    if (self.status_callback) {
                        response.writeHead(200);
                        response.write(self.status_callback());
                    }
                    break;
                default:
                    response.writeHead(404);
            }
            response.end();
        });

        // Démarre le serveur HTTP
        this._httpServer.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });

        // Crée un serveur WebSocket
        this._wsServer = new WebSocket.Server({ server: this._httpServer });

        // Gère les nouvelles connexions WebSocket
        this._wsServer.on('connection', (ws) => {
            const connectionId = self._createId();
            const connection = new WebSocketConnection(connectionId, ws, self);

            // Appelle le callback de connexion
            if (self.connection_callback) {
                self.connection_callback(connection);
            }
            self.addConnection(connection);
        });
    }

    _createId() {
        return '5' + Utils.random(99) + '' + (this._counter++);
    }

    broadcast(message) {
        // Diffuse un message à toutes les connexions WebSocket
        this.forEachConnection((connection) => connection.send(message));
    }

    onRequestStatus(status_callback) {
        this.status_callback = status_callback;
    }
}

// Classe Connection spécifique pour `ws`
class WebSocketConnection extends Connection {
    constructor(id, connection, server) {
        super(id, connection, server);

        // Écoute les messages entrants
        this._connection.on('message', (message) => {
            if (this.listen_callback) {
                try {
                    const parsedMessage = useBison ? BISON.decode(message) : JSON.parse(message);
                    this.listen_callback(parsedMessage);
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        this.close("Received message was not valid JSON.");
                    } else {
                        throw error;
                    }
                }
            }
        });

        // Écoute la fermeture de la connexion
        this._connection.on('close', () => {
            if (this.close_callback) {
                this.close_callback();
            }
            this._server.removeConnection(this.id);
        });
    }

    send(message) {
        let data;
        if (useBison) {
            data = BISON.encode(message);
        } else {
            data = JSON.stringify(message);
        }
        this.sendUTF8(data);
    }

    sendUTF8(data) {
        this._connection.send(data);
    }
}

WS.WebSocketServer = WebSocketServer;
WS.WebSocketConnection = WebSocketConnection;

module.exports = WS;
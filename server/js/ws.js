const WebSocket = require('ws');
const http = require('http');
const url = require('url');
const Utils = require('./utils');
const _ = require('underscore');

let connectionCounter = 0;

class Connection {
    constructor(id, socket, server) {
        this.id = id;
        this._socket = socket;
        this._server = server;
        this._listenCallback = null;
        this._closeCallback = null;

        this._socket.on('message', (data) => {
            if (this._listenCallback) {
                try {
                    const message = JSON.parse(data);
                    this._listenCallback(message);
                } catch (e) {
                    console.error("Invalid JSON:", e);
                    this.close("Invalid JSON");
                }
            }
        });

        this._socket.on('close', () => {
            if (this._closeCallback) {
                this._closeCallback();
            }
            this._server.removeConnection(this.id);
        });
    }

    listen(callback) {
        this._listenCallback = callback;
    }

    onClose(callback) {
        this._closeCallback = callback;
    }

    send(message) {
        const data = JSON.stringify(message);
        if (this._socket.readyState === WebSocket.OPEN) {
            this._socket.send(data);
        }
    }

    close(reason) {
        console.log(`Closing connection ${this.id}. Reason: ${reason}`);
        this._socket.close();
    }
}

class WebSocketServerWrapper {
    constructor(port) {
        this.port = port;
        this._connections = {};
        this._connectionCallback = null;
        this._errorCallback = null;
        this._statusCallback = null;

        this._httpServer = http.createServer((req, res) => {
            const path = url.parse(req.url).pathname;
            if (path === '/status' && this._statusCallback) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(this._statusCallback());
            } else {
                res.writeHead(404);
                res.end();
            }
        });

        this._wsServer = new WebSocket.Server({ server: this._httpServer });

        this._wsServer.on('connection', (socket, req) => {
            const id = this._createId();
            const connection = new Connection(id, socket, this);
            this._connections[id] = connection;

            if (this._connectionCallback) {
                this._connectionCallback(connection);
            }
        });

        this._httpServer.listen(port, () => {
            console.log(`WebSocket server is listening on port ${port}`);
        });

        this._wsServer.on('error', (err) => {
            if (this._errorCallback) {
                this._errorCallback(err);
            } else {
                console.error("WebSocket server error:", err);
            }
        });
    }

    onConnect(callback) {
        this._connectionCallback = callback;
    }

    onError(callback) {
        this._errorCallback = callback;
    }

    onRequestStatus(callback) {
        this._statusCallback = callback;
    }

    _createId() {
        return 'ws_' + Utils.random(99) + '_' + (connectionCounter++);
    }

    broadcast(message) {
        for (let id in this._connections) {
            this._connections[id].send(message);
        }
    }

    removeConnection(id) {
        delete this._connections[id];
    }
}

module.exports = {
    MultiVersionWebsocketServer: WebSocketServerWrapper
};

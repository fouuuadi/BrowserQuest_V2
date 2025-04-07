var fs = require('fs'),
    Metrics = require('./metrics');

    function main(config) {
        var log = console; // Utilisation de console pour la journalisation
    
        var ws = require("./ws"),
            WorldServer = require("./worldserver"),
            _ = require('underscore'),
            server = new ws.MultiVersionWebsocketServer(config.port),
            metrics = config.metrics_enabled ? new Metrics(config) : null,
            worlds = [],
            lastTotalPlayers = 0,
            checkPopulationInterval = setInterval(function() {
                if (metrics && metrics.isReady) {
                    metrics.getTotalPlayers(function(totalPlayers) {
                        if (totalPlayers !== lastTotalPlayers) {
                            lastTotalPlayers = totalPlayers;
                            _.each(worlds, function(world) {
                                world.updatePopulation(totalPlayers);
                            });
                        }
                    });
                }
            }, 1000);
    
        // Remplacez les niveaux de journalisation par console.log
        switch (config.debug_level) {
            case "error":
                log.error = console.error; break;
            case "debug":
                log.debug = console.log; break;
            case "info":
                log.info = console.log; break;
        }
    
        log.info("Starting BrowserQuest game server...");
    
        server.onError(function() {
            log.error(Array.prototype.join.call(arguments, ", "));
        });
    
        process.on('uncaughtException', function(e) {
            log.error('uncaughtException: ' + e);
        });
    }

function getWorldDistribution(worlds) {
    var distribution = [];
    
    _.each(worlds, function(world) {
        distribution.push(world.playerCount);
    });
    return distribution;
}

function getConfigFile(path, callback) {
    fs.readFile(path, 'utf8', function(err, json_string) {
        if(err) {
            console.error("Could not open config file:", err.path);
            callback(null);
        } else {
            callback(JSON.parse(json_string));
        }
    });
}

var defaultConfigPath = './server/config.json',
    customConfigPath = './server/config_local.json';

process.argv.forEach(function (val, index, array) {
    if(index === 2) {
        customConfigPath = val;
    }
});

getConfigFile(defaultConfigPath, function(defaultConfig) {
    getConfigFile(customConfigPath, function(localConfig) {
        if(localConfig) {
            main(localConfig);
        } else if(defaultConfig) {
            main(defaultConfig);
        } else {
            console.error("Server cannot start without any configuration file.");
            process.exit(1);
        }
    });
});
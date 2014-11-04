var io = require('socket.io').listen(8083);
var socketArray = [];
var players = [];
var carColors = ['blue', 'green', 'grey', 'olive', 'orange', 'purple', 'red', 'white', 'yellow'];
var gameGridActive = false;
var gameGridSocket = {};
var maxPlayer = 6;

var serveBouncerPage = function (socket) {
    socket.emit('serveBouncerPage');
};

io.sockets.on('connection', function (socket) {


    console.log('connection made');

    if (!gameGridActive) {
        // this is the game grid
        
        gameGridActive = true;
        gameGridSocket = socket;

    } else {
        // this is a player

        if (players.length < 6) {
            socketArray.push(socket.id);
        } else {
            // already have 6 people joined, return bouncer page
            serveBouncerPage(socket);
        }
    }

    socket.on('initialisePlayer', function (playerConfig) {

        if (!playerConfig.playerName) {
            console.log('Error found in config settings');
            socket.emit('configError');
            return false;
        }

        if (players.length < (maxPlayer-1)) {
            playerConfig.playerColor = carColors.pop();
            console.log('setting up user...');
            players.push(playerConfig);
            socket.emit('userReady', players);
            socket.broadcast.emit('sendUpdatedPlayers', players);

        } else if (players.length === (maxPlayer-1)) {
            playerConfig.playerColor = carColors.pop();
            players.push(playerConfig);
            socket.emit('userReady', players);
            socket.broadcast.emit('sendUpdatedPlayers', players);

            // this is the  6th player, game will begin now
            io.sockets.emit('beginGame',players);

        } else {

            //there are already 6 players, return this socket with bouncer page
            serveBouncerPage(socket);

        }
        //io.sockets.socket(socketArray[0]).emit('turnGrid', val);
    });

    socket.on('turning', function (turningValue) {
        // do something with the turned value (-1 to 1)
        console.log(socket.id + ' is turning by ' + turningValue);

        var carEvent = {
            socketID: socket.id,
            movementValue: turningValue
        };

        io.sockets.emit('ggTurning', carEvent);
        // gameGridSocket.emit('ggTurning', carEvent);
    });

    socket.on('acceleration', function (accelerationValue) {
        // do something with the acceleration value (-1 to 0 for braking/reverse, 0-1 for forward acceleration)
        console.log(socket.id + ' is accerating by ' + accelerationValue);

        var carEvent = {
            socketID: socket.id,
            movementValue: accelerationValue
        };

        io.sockets.emit('ggAcceleration', carEvent);
        // gameGridSocket.emit('ggAcceleration', carEvent);
    });

});
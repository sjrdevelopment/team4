var io = require('socket.io').listen(8083);
var socketArray = [];

io.sockets.on('connection', function (socket) {

    console.log('connection made');
     socketArray.push(socket.id);

    socket.on('turnWheel', function(val) {
       console.log('turning: ' + val); 
       io.sockets.socket(socketArray[0]).emit('turnGrid', val);
    });

});
# Events emitted by controller: 
* acceleration (floating point decimal -1 to 1)
* turning (floating point decimal -1 to 1)

####Above events as handled in server.js:
```
	socket.on('turning', function (turningValue) {
        // do something with the turned value (-1 to 1)
        console.log(socket.id + ' is turning by ' + turningValue);
    });

    socket.on('acceleration', function (accelerationValue) {
        // do something with the acceleration value
        // (-1 to 0 for braking/reverse, 0-1 for forward acceleration)
        console.log(socket.id + ' is accerating by ' + accelerationValue);
    });
```

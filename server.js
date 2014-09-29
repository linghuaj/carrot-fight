(function () {
    Util = {};
    Util.genRandInt = function (min, max) {
        return min + Math.random() * (max - min);
    };
    var io = require('socket.io').listen(8088);
    var bunnies = {};
    var carrotPos = {x: 100, y: 100};

    io.sockets.on('connection', function (socket) {
        var uid;
        socket.emit('init-user', {
            'allBunnies': bunnies,
            'carrotPos': carrotPos
        });
        //when new user connected, add it to all bunnies. and broadcast to all sockets.
        socket.on("user-connected", function (data) {
            uid = data.rabbitUid;
            bunnies[data.rabbitUid] = data.bunnyPos;
            //broad cast to other sockets
            socket.broadcast.emit('user-connected', data);
        });

        socket.on("bunny-moved", function (data) {
            console.log("bunny-moved", data);
            socket.broadcast.emit('bunny-moved', data);
        });

        socket.on("carrot-eaten", function (data) {
            carrotPos = {
                x: Util.genRandInt(data.carrotSize, data.width - data.carrotSize),
                y: Util.genRandInt(data.carrotSize, data.height - data.carrotSize)
            };
            io.sockets.emit('carrot-redraw', carrotPos);
        });

        socket.on('disconnect', function () {
            //remove this bunny from cached array;
            delete(bunnies[uid]);
            //broadcast to other sockets that this bunny is disconnected
            io.sockets.emit('user-disconnected',{uid:uid});
        });
    });

}).call(this);
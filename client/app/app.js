define([
    "jquery",
    "PIXI",
    "bower_cmp/socket.io-client/socket.io",
    "common/util",
    "common/carrot",
    "common/bunny"

], function($, PIXI, io, Util, Carrot, Bunny){
    var App = {};
    App.socket = io.connect('http://10.15.1.155:8088');
    //bunnies produced by different users keyed by uuid
    App.bunnies = {};
    App.carrot = {};
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);
    App.screenSize = {
        width:500,
        height:300
    };
    // create a renderer instance
    var renderer = new PIXI.WebGLRenderer(App.screenSize.width,App.screenSize.height);//autoDetectRenderer(400, 300);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);

    requestAnimFrame(animate);
    function animate() {
        requestAnimFrame(animate);
        renderer.render(stage);
    }

    App.socket.on("init-user", function (data) {
        //init all bunnies from server data
        for (var uid in data.allBunnies){
            if (uid == App.rabbitUid){
                continue;
            }
            var bunnyPos = data.allBunnies[uid].bunnyPos;
            var bunnyI = new Bunny(null,bunnyPos,
                App.screenSize,
                uid, App.socket, $('canvas'));//$canvas is used for eventBus
            bunnyI.tint = "0x33CCFF";
            App.bunnies[uid] = bunnyI;
            stage.addChild(bunnyI);
        }
        //init carrot from server data
        App.carrot = new Carrot(null, data.carrotPos);
        stage.addChild( App.carrot);
    });


    App.InitUser = function () {

        if (document.cookie && document.cookie.match(/rabbitUid=(.*)/)) {
            App.rabbitUid = document.cookie.match(/rabbitUid=(.*)/)[1];
        } else {
            App.rabbitUid = Util.genUUID();
            document.cookie = "rabbitUid=" + App.rabbitUid + ";";
        }
        var x = Util.genRandInt(50,
                App.screenSize.width - 50);
        var y = Util.genRandInt(50, App.screenSize.height - 50);
        App.bunny = new Bunny(null, {x: x, y: y},
            App.screenSize,
            App.rabbitUid,App.socket, $('canvas'));
        stage.addChild(App.bunny);
        App.socket.emit("user-connected", {rabbitUid: App.rabbitUid, bunnyPos: App.bunny.position});
        return App.rabbitUid;
    };
    App.InitUser();

   window.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case 37: // Left
                App.bunny.moveLeft();
                break;

            case 38: // Up
                App.bunny.moveUp();
                break;

            case 39: //
                App.bunny.moveRight();
                break;

            case 40: // Down
                App.bunny.moveDown();
                break;
        }
    }, false);


   $('canvas').on('bunny-moved', function (e, bunny) {
        if (Util.isIntersecting( App.carrot, bunny)) {
            App.socket.emit("carrot-eaten", {carrotSize: 50, width: App.screenSize.width, height: App.screenSize.height});
        }
    });

    App.socket.on("carrot-redraw", function (data) {
        App.carrot.redraw(data.x, data.y);
    });

    App.socket.on("bunny-moved", function (data) {
        App.bunnies[data.id].redraw(data.pos.x, data.pos.y);
    });

    App.socket.on("user-connected", function(newBunny){
        var uid = newBunny.rabbitUid;
        App.bunnies[uid] = new Bunny(null,newBunny.bunnyPos,uid, App.socket,$('canvas'));
        stage.addChild(App.bunnies[uid]);
    });

    App.socket.on("user-disconnected", function(data){
        console.log("user disconnected", data);
        stage.removeChild(App.bunnies[data.uid]);
        delete(App.bunnies[data.uid]);

    })

});




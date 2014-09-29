define(['PIXI','jquery'], function(PIXI,$){
     var socket_, eventBus_;

     function Bunny(texture, position, screenSize, id, socket, eventBus) {
        texture = texture || PIXI.Texture.fromImage("app/assets/bunny.png");
        PIXI.Sprite.call(this, texture);
        this.anchor = {x: 0.5, y: 0.5};
        this.position = position || {x: 200, y: 200};
        this.scale = {x: 0.5, y: 0.5};
        this.step = 10; //move left||right||up||down delta
        this.tint = 0xFFFFFF;
        this.screenSize = screenSize;
        this.id = id;
        this.socket_ = socket;
        eventBus_ = eventBus;
    }


    Bunny.prototype = Object.create(PIXI.Sprite.prototype);
    Bunny.prototype.constructor = Bunny;
    Bunny.prototype.moveRight = function () {
        this.position.x += 10;
        if (this.position.x > this.screenSize.width) {
            this.position.x = 0;
        }
        this.broadCastPosition();
    };
    Bunny.prototype.moveLeft = function () {
        this.position.x -= 10;
        if (this.position.x < 0) {
            this.position.x = this.screenSize.width;
        }
        this.broadCastPosition();
    };
    Bunny.prototype.moveUp = function () {
        this.position.y -= 10;
        if (this.position.y < 0) {
            this.position.y = this.screenSize.height;
        }
        this.broadCastPosition();
    };

    Bunny.prototype.moveDown = function () {
        this.position.y += 10;
        if (this.position.y > this.screenSize.height) {
            this.position.y = 0;
        }
        this.broadCastPosition();
    };
//redraw bunny's position based on passed in x and y
    Bunny.prototype.redraw = function (x, y) {
        this.position.x = x;
        this.position.y = y;
    };
//broadcas current bunny's location
    Bunny.prototype.broadCastPosition = function () {
        this.socket_.emit("bunny-moved", {
            pos: {
                x: this.position.x, y: this.position.y
            }, id: this.id
        });

        console.log("broadcast");

        $('canvas').trigger('bunny-moved', this);
//       var bunnyMoveEvent =  new Event(
//            'bunny-moved',this);
//        //TODO: document could be passed from config
//        window.dispatchEvent(bunnyMoveEvent);
    };

    return Bunny;

});
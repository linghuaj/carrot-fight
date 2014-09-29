define(['PIXI'], function(PIXI){

   function Carrot(texture, position) {
        texture = texture || PIXI.Texture.fromImage("app/assets/carrot.png");
        PIXI.Sprite.call(this, texture);
        this.anchor = {x: 0.5, y: 0.5};
        this.position = position
        this.scale = {x: 0.5, y: 0.5};
    }

    Carrot.prototype = Object.create(PIXI.Sprite.prototype);
    Carrot.prototype.constructor = Carrot;
    Carrot.prototype.redraw = function (x, y) {
        this.position.x = x;
        this.position.y = y;
    };

    return Carrot;
});
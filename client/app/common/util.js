define([], function () {
    var Util = {};
    Util.genRandInt = function (min, max) {
        // console.log("genRandInt",min, max);
        return min + Math.random() * (max - min);
    };
    Util.genUUID = (function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return function () {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
    })();

    //detect if two pixi objects are intersecting.
    Util.isIntersecting = function (o1, o2) {
        if (o1.position.x + o1.width > o2.position.x &&
            o1.position.y + o1.height > o2.position.y &&
            o1.position.x + o1.width < o2.position.x + o2.width
            && o1.position.y + o1.height < o2.position.y + o2.height)
        {
            return true;
        }
        return false;
    };

    return Util;
});
/**
 * Created by Nigel on 26/11/2016.
 */

/**
 * @class Ground
 * @description A platform or a wall of the game
 */
class Ground{

    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {Boolean} [isStatic=true]
     */
    constructor(x,y,width,height,isStatic=true){
        this.name = name
        this.body = new Bodies.rectangle(x, y, width, height, {
            isStatic: isStatic
        })
    }

    /**
     * @method setPosition
     * @description Set the position of the player
     * @param {Number} x
     * @param {Number} y
     */
    setPosition(x, y) {

        this.body.setPosition(this.body, {x, y})

    }

}

module.exports = Ground
/**
 * Created by Nigel on 26/11/2016.
 */

var PhysicalElement = require('./PhysicalElement')

/**
 * @class Ground
 * @extends PhysicalElement
 * @description A platform or a wall of the game
 */
class Ground extends PhysicalElement{

    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {Boolean} [isStatic=true]
     */
    constructor(x,y,width,height,isStatic=true){
        super(x,y,width,height)
        this.body = new Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
            isStatic: isStatic
        })
    }

}

module.exports = Ground
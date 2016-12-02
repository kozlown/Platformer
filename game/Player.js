/**
 * Created by Nigel on 26/11/2016.
 */

var PhysicalElement = require('./PhysicalElement')

/**
 * @class Player
 * @extends PhysicalElement
 * @description A player of the game
 */
class Player extends PhysicalElement{

    /**
     * @constructor
     * @param {String} name
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {Object} socket
     */

    constructor(name, x, y, width, height, socket) {

        super(x,y,width,height)
        this.name = name
        this.socket = socket
        this.body = new Bodies.rectangle(x, y, width, height)

    }

}

module.exports = Player
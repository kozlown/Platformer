/**
 * Created by Nigel on 26/11/2016.
 */

/**
 * @class Player
 * @description A player of the game
 */
class Player {

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

        this.name = name
        this.socket = socket
        this.body = new Bodies.rectangle(x, y, width, height)

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

module.exports = Player
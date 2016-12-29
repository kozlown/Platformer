/**
 * Created by Nigel on 06/12/2016.
 */

let PositionableElement = require("./PositionableElement")

/**
 * @class Respawn
 * @extends PositionableElement
 * @description A Respawn for the players
 */
class Respawn extends PositionableElement{

    /**
     * @constructor
     * @description constructor of a Respawn instance
     */
     constructor( x, y ){

        super(x,y)
     }
}

module.exports = Respawn
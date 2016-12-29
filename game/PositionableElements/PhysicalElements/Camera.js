/**
 * Created by Nigel on 14/12/2016.
 */

let PhysicalElement = require( './PhysicalElement' )

/**
 * @class Camera
 * @description A camera of the game
 * @extends {PhysicalElement}
 */
class Camera extends PhysicalElement {

    /**
     * @constructor
     * @description constructor of a Camera instance
     */
    constructor( x, y, width, height ){

        super( x, y, width, height )

    }

}

module.exports = Camera
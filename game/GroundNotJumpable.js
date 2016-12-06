/**
 * Created by Nigel on 06/12/2016.
 */
let Ground = require("./Ground.js")

/**
 * @class GroundNotJumpable
 * @extends Ground
 * @description A Ground where players don't reset their quota of jumps
 */
class GroundNotJumpable extends Ground {

    /**
     * @constructor
     * @description constructor of a GroundNotJumpable instance
     */
     constructor( x,y,width,height,isStatic=true ){

        super( x,y,width,height,isStatic )
     }

    /**
     * @method handleCollisionWith
     * @override
     * @description handle collision with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionWith( physicalElement ) {

        switch (physicalElement.constructor.name) {

            default:
                // do nothing
                break
        }
    }
}

module.exports = GroundNotJumpable
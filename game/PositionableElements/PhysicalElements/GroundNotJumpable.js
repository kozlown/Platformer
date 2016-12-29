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
     * @method handleCollisionStartWith
     * @override
     * @description handle collision start with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionStartWith( physicalElement ){

        switch (physicalElement.constructor.name){

            default:
                // do nothing
                break
        }
    }

    /**
     * @method handleCollisionActiveWith
     * @override
     * @description handle collision active (after engine update) with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionActiveWith( physicalElement ){

        switch (physicalElement.constructor.name){

            default:
                // do nothing
                break
        }
    }

    /**
     * @method handleCollisionEndWith
     * @override
     * @description handle collision end (collision that have ended in the current tick) with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionEndWith( physicalElement ){

        switch (physicalElement.constructor.name){

            default:
                // do nothing
                break
        }
    }
}

module.exports = GroundNotJumpable
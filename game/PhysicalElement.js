/**
 * Created by Nigel on 29/11/2016.
 */

/**
 * @class PhysicalElement
 * @abstract
 * @description A physical element of a game
 */
class PhysicalElement {

    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {String} type
     */
    constructor(x,y,width,height){
        if (this.constructor === PhysicalElement){
            throw new Error("Can't instantiate abstract class !")
            return
        }
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.state = {}
        this.id = uniqid()
    }

    /**
     * @method setPosition
     * @description Set the position of the physical element
     * @param {Number} x
     * @param {Number} y
     */
    setPosition(x, y) {

        this.x = x
        this.y = y

        this.body.setPosition(this.body, {
            x: this.x,
            y: this.y
        })

    }

    /**
     * @method handleCollisionStartWith
     * @abstract
     * @description handle collision start with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionStartWith( physicalElement ){

        throw new Error("This method is abstract, you must override it before using it !")
    }

    /**
     * @method handleCollisionActiveWith
     * @abstract
     * @description handle collision active (after engine update) with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionActiveWith( physicalElement ){

        throw new Error("This method is abstract, you must override it before using it !")
    }

    /**
     * @method handleCollisionEndWith
     * @abstract
     * @description handle collision end (collision that have ended in the current tick) with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionEndWith( physicalElement ){

        throw new Error("This method is abstract, you must override it before using it !")
    }


}

module.exports = PhysicalElement
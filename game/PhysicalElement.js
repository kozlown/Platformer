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
     * @method handleCollisionWith
     * @abstract
     * @description handle collision with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionWith( physicalElement ){

        throw new Error("This method is abstract, you must override it before using it !")
    }


}

module.exports = PhysicalElement
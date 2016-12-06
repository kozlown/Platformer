/**
 * Created by Nigel on 29/11/2016.
 */

let PositionableElement = require("./PositionableElement")

/**
 * @class PhysicalElement
 * @abstract
 * @extends PositionableElement
 * @description A physical element of a game
 */
class PhysicalElement extends PositionableElement {

    /**
     * @constructor
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {String} type
     */
    constructor(x,y,width,height){
        super(x,y)
        if (this.constructor.name === "PhysicalElement"){
            throw new Error("Can't instantiate abstract class !")
        }
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

        super.setPosition(x, y)

        Body.setPosition(this.body, {
            x: this.position.x,
            y: this.position.y
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
/**
 * Created by Nigel on 29/11/2016.
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
        this.x = x
        this.y = y
        this.width = width
        this.height = height
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

}

module.exports = PhysicalElement
/**
 * Created by Nigel on 06/12/2016.
 */

/**
 * @class PositionableElement
 * @abstract
 * @description An element which is Positionable
 */
class PositionableElement {

    /**
     * @constructor
     * @description constructor of a PositionableElement instance
     */
     constructor( x, y ){
        if (this.constructor.name === "PositionableElement"){
            throw new Error("Can't instantiate abstract class !")
        }
        this.position = {
            x : x,
            y : y
        }

     }

     /**
      * @method setPosition
      * @description set the position of the element
      * @param {Number} x
      * @param {Number} y
      */
     setPosition( x, y ){

         this.position = {
             x : x,
             y : y
         }

     }
}

module.exports = PositionableElement
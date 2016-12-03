/**
 * Created by Nigel on 26/11/2016.
 */

var PhysicalElement = require('./PhysicalElement')

/**
 * @class Player
 * @extends PhysicalElement
 * @description A player of the game
 */
class Player extends PhysicalElement{

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

        super(x,y,width,height)
        this.name = name
        this.socket = socket
        this.body = new Bodies.rectangle(x, y, width, height, {
            inertia: Infinity
        })

    }

    /**
     * @method moveLeft
     * @description applies one more movement step to the left
     */
    moveLeft(){

        let force = Matter.Vector.create(-0.3 / 60, 0)
        Body.applyForce(this.body, this.body.position, force)

    }

    /**
     * @method moveRight
     * @description applies one more movement step to the right
     */
    moveRight(){

        let force = Matter.Vector.create(0.3 / 60, 0)
        Body.applyForce(this.body, this.body.position, force)

    }

    /**
     * @method jump
     * @description jumps (apply single upward force)
     */
    jump(){

        let force = Matter.Vector.create(0, -0.1)
        Body.applyForce(this.body, this.body.position, force)

    }

    /**
     * @method move
     * @description calls movement functions depending of the player's state ( movingRight | movingLeft | etc. )
     */
    move(){

        if (this.state.isMovingLeft){

            this.moveLeft()

        }

        if (this.state.isMovingRight){

            this.moveRight()

        }

    }

}

module.exports = Player
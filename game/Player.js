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
        this.jumpsToUse = 2
        this.jumpsUsed = 0
        this.name = name
        this.socket = socket
        this.body = new Bodies.rectangle(x, y, width, height, {
            inertia: Infinity,
            friction: 0,
            frictionAir: 0.05,
            mass: 3,
            inverseMass: 1/2,
            frictionStatic: 0,
        })
    }

    /**
     * @method moveLeft
     * @description applies one more movement step to the left
     */
    moveLeft(){

        let force = Matter.Vector.create(-0.5 / 60, 0)
        Body.applyForce(this.body, this.body.position, force)

    }

    /**
     * @method moveRight
     * @description applies one more movement step to the right
     */
    moveRight(){

        let force = Matter.Vector.create(0.5 / 60, 0)
        Body.applyForce(this.body, this.body.position, force)

    }

    /**
     * @method jump
     * @description jumps (apply single upward force)
     */
    jump(){

        // check if the users has jumps
        if (this.jumpsUsed >= this.jumpsToUse){
            return
        }

        // increment the number of jumps used
        this.jumpsUsed++

        // first set the y-velocity to 0
        let velocity = Matter.Vector.create( this.body.velocity.x, 0 )
        Body.setVelocity(this.body, velocity)

        // then apply force
        let force = Matter.Vector.create(0, -0.3)
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

    /**
     * @method handleCollisionStartWith
     * @override
     * @description handle collision start with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionStartWith( physicalElement ){

        switch (physicalElement.constructor.name){

            case "GroundJumpable":
                // if he's going down
                if (this.body.velocity.y > 0){
                    // reset the number of jumps used
                    this.jumpsUsed = 0
                }
                break
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

            case "GroundNotJumpable":
                // if he's stationary
                if (this.body.velocity.y == 0){
                    // reset the number of jumps used
                    this.jumpsUsed = 0
                }
                break
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

module.exports = Player
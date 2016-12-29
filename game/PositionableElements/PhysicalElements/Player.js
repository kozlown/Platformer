/**
 * Created by Nigel on 26/11/2016.
 */

var PhysicalElement = require('./PhysicalElement')

/**
 * @class Player
 * @extends PhysicalElement
 * @description A player of the game
 */
class Player extends PhysicalElement {

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

        super(x, y, width, height)
        this.state = {
            name: "undefined",
            allowedJumps: 2,
            usedJumps: 0,
            wallJump: false
        }
        this.name = name
        this.socket = socket
        this.socket.player = this
        this.gameId = this.socket.gameId
        this.body = new Bodies.rectangle(x, y, width, height, {
            inertia: Infinity,
            friction: 0,
            frictionAir: 0.05,
            mass: 3,
            inverseMass: 1 / 2,
            frictionStatic: 0,
        })
        this.collisions = {}
    }

    /**
     * @method moveLeft
     * @description applies one more movement step to the left
     */
    moveLeft() {

        let force = Matter.Vector.create(-0.5 / 60, 0)
        Body.applyForce(this.body, this.body.position, force)

    }

    /**
     * @method moveRight
     * @description applies one more movement step to the right
     */
    moveRight() {

        let force = Matter.Vector.create(0.5 / 60, 0)
        Body.applyForce(this.body, this.body.position, force)

    }

    /**
     * @method jump
     * @description jumps (apply single upward force)
     */
    jump() {

        // check if the player has jumps
        if (this.state.usedJumps >= this.state.allowedJumps) {
            return
        }
        // increment the number of used jumps
        this.state.usedJumps++

        // determine new velocity on x-axis
        let x = this.body.velocity.x
        if (this.state.name === "on the side") {
            switch (this.state.wallJump) {
                case "right":
                    x = 15
                    break
                case "left":
                    x = -15
                    break
            }
        }

        // determine new velocity on y-axis
        let y = -33

        // set a new vector of with new velocity
        let newVelocity = Matter.Vector.create(x, y)

        // Apply the new velocity to the player
        Body.setVelocity(this.body, newVelocity)
    }

    /**
     * @method move
     * @description calls movement functions depending of the player's state ( movingRight | movingLeft | etc. )
     */
    move() {

        // if the player wants to move on the left
        if (this.state.isMovingLeft) {

            // if the player is on the side
            // he must take a time to move out
            if (this.state.name == "on the side") {

                setTimeout(this.moveLeft.bind(this), 100)
            }
            else {

                this.moveLeft()
            }
        }

        // if the player wants to move on the right
        if (this.state.isMovingRight) {

            // if the player is on the side
            // he must take a time to move out
            if (this.state.name == "on the side") {

                setTimeout(this.moveRight.bind(this), 100)
            }
            else {

                this.moveRight()
            }
        }
    }

    /**
     * @method handleCollisionStartWith
     * @override
     * @description handle collision start with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionStartWith(physicalElement) {

        this.collisions[physicalElement.id] = {
            positionBefore: {
                x: this.body.position.x,
                y: this.body.position.y
            },
            physicalElement: physicalElement,
            active: false
        }
    }

    /**
     * @method handleCollisionActiveWith
     * @override
     * @description handle collision active (after engine update) with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionActiveWith(physicalElement) {

        let positionBefore = this.collisions[physicalElement.id].positionBefore

        // if it's the first time that the event "CollisionActive" is triggered for this collision
        if (!this.collisions[physicalElement.id].positionAfter) {

            // set the velocityAfter property of the collision to the actual velocity of the player
            this.collisions[physicalElement.id].positionAfter = {
                x: this.body.position.x,
                y: this.body.position.y
            }
        }

        // active the collision
        this.collisions[physicalElement.id].active = true

        // update the state of the player
        this.updateState()

        // if the player wants to jump
        if (this.state.wantsToJump) {

            // try to jump
            this.jump()
        }


    }

    /**
     * @method handleCollisionEndWith
     * @override
     * @description handle collision end (collision that have ended in the current tick) with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionEndWith(physicalElement) {

        // remove the collision from player.collisions
        delete this.collisions[physicalElement.id]
    }

    /**
     * @method updateState
     * @description Update the state of the player depending of his actual collisions
     */
    updateState() {
        // set the state name to "falling"
        this.state.name = "falling"
        _.each(this.collisions, (collision, key, collection) => {

            let pb = collision.positionBefore
            let pa = collision.positionAfter

            // check if the collision is active
            if (collision.active)
                // determine the state depending of the type of physicalElement colliding with the player
                switch (collision.physicalElement.constructor.name) {
                    case "GroundJumpable": {

                        // if coming from the left side
                        if (_.floor(pa.x + this.width / 2) === _.floor(collision.physicalElement.body.position.x - collision.physicalElement.width / 2)) {

                            // and if not standing on a block
                            if (this.state.name !== "stand") {

                                // set the number of used jumps to 1
                                this.state.usedJumps = 1

                                // set the wallJump state attribute to "left"
                                this.state.wallJump = "left"

                                // set the state to "on the side"
                                this.state.name = "on the side"
                            }
                        }

                        // if coming from the right side
                        if (_.ceil(pa.x - this.width / 2) === _.ceil(collision.physicalElement.body.position.x + collision.physicalElement.width / 2)) {

                            // and if not standing on a block
                            if (this.state.name !== "stand") {

                                // set the number of used jumps to 1
                                this.state.usedJumps = 1

                                // set the wallJump state attribute to "left"
                                this.state.wallJump = "right"

                                // set the state to "on the side"
                                this.state.name = "on the side"
                            }
                        }

                        // if standing on the top
                        if (_.floor(pa.y + this.height / 2) === _.floor(collision.physicalElement.body.position.y - collision.physicalElement.height / 2)) {

                            // reset the number of used jumps
                            this.state.usedJumps = 0

                            // set the state to "stand"
                            this.state.name = "stand"
                        }
                        break
                    }
                    case "GroundNotJumpable": {
                        // if standing on the top
                        if (_.floor(pa.y + this.height / 2) === _.floor(collision.physicalElement.body.position.y - collision.physicalElement.height / 2)) {

                            // reset the number of used jumps
                            this.state.usedJumps = 0

                            // set the state to "stand"
                            this.state.name = "stand"
                        }
                        break
                    }
                    default: {
                        // do nothing
                        break
                    }
                }
        })

    }
}

module.exports = Player
/**
 * Created by Nigel on 09/12/2016.
 */

let Player = require("./Player.js")

/**
 * @class Zombie
 * @description a {Zombie}
 */
class Zombie extends Player {
    
    /** 
     * @constructor
     * @description constructor of a Zombie instance
     */
    constructor( player ){

        super( player.name, player.body.position.x, player.body.position.y, player.width, player.height, player.socket )

    }

    /**
     * @method handleCollisionStartWith
     * @override
     * @description handle collision start with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionStartWith( physicalElement ){

        super.handleCollisionStartWith( physicalElement )

        switch (physicalElement.constructor.name){
            // if it's a player, then he becomes a zombie
            case "Player":
                physicalElement = new Zombie( physicalElement )
                break
            default:
                // do nothing
                break
        }

    }
     
}

module.exports = Zombie
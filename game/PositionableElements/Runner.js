/**
 * Created by Nigel on 18/12/2016.
 */

let Player = require("./PhysicalElements/Player")

/**
 * @class Runner
 * @description a {Runner}
 */
class Runner extends Player {

    /**
     * @constructor
     * @description constructor of a Runner instance
     */
    constructor( player ){

        super( player.name, player.body.position.x, player.body.position.y, player.width, player.height, player.socket )
        this.state.immunity = true
        // 5s of immunity
        setTimeout((  )=>{
            this.state.immunity = false
        }, 5000)
    }

    /**
     * @method handleCollisionStartWith
     * @override
     * @description handle collision start with another PhysicalElement
     * @param {PhysicalElement} physicalElement
     */
    handleCollisionActiveWith( physicalElement ){

        super.handleCollisionActiveWith( physicalElement )

        switch (physicalElement.constructor.name){
            // if it's a player, then he becomes a zombie
            case "Zombie":
                // if the runner is immunized, do nothing
                if (this.state.immunity) break
                // else the zombie becomes a runner
                gamesManager.getGame(physicalElement.gameId).addElement(new Runner( physicalElement ))
                gamesManager.getGame(physicalElement.gameId).deleteElement(physicalElement)
                break
            default:
                // do nothing
                break
        }

    }

}

module.exports = Runner
/**
 * Created by Nigel on 18/12/2016.
 */

let Player = require("./Player")

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

    }

}

module.exports = Runner
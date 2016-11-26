/**
 * Created by Nigel on 26/11/2016.
 */

/**
 * @class Game
 * @description A game
 */
class Game {

    /**
     * @constructor
     * @param {String} name
     * @param {Number} fps
     * @param {String} map
     */
    constructor(name, fps, map) {

        this.name = name
        this.fps = fps
        this.map = map
        this.players = []

        // create the engine of the game
        this.engine = Engine.create()

    }

    /**
     * @method start
     * @description Start the game
     */
    start() {

        // launch the main loop and save it, so it will be stopped when the game stop
        this.mainLoop = setInterval(this.step.bind(this), 1000 / this.fps);

        console.log(`Game started !`)

    }

    /**
     * @method step
     * @description Go to the next state of the game
     */
    step(){
        Engine.update(this.engine, 1000 / this.fps);
        let gameUpdateInformations = {
            players : {},
            grounds : {}
        }
        _.each(_.values(this.players),(player)=>{
            gameUpdateInformations.players[player.name] = ({
                position: player.body.position,
                width: player.body.width,
                height: player.body.height
            })
        })
        _.each(_.values(this.players),(player)=>{
            player.socket.emit("gameUpdate", gameUpdateInformations)
        })

    }

    /**
     * @method end
     * @description End the game
     */
    end() {

        // stop the main loop
        clearInterval(this.mainLoop)

        // remove the game
        delete currentGames[this.name]

    }

    /**
     * @method addPlayer
     * @description Add a new player to the game
     * @param {Player} player
     */
    addPlayer(player) {

        // add the player to the players array
        this.players[player.name] = player

        // add the player physically to the world of the game
        World.add(this.engine.world, player.body);

    }

    /**
     * @method removePlayer
     * @description Remove a player from the game
     * @param player
     */
    removePlayer(player) {

        // remove the player from the players array
        delete this.players[player.name]

        // remove the player physically from the world of the game
        World.remove(this.engine.world, player.body, true);
    }

}

module.exports = Game;

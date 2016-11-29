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

        this.id = uniqid()
        this.name = name
        this.fps = fps
        this.map = map
        this.physicalElements = []

        // create the engine of the game
        this.engine = Engine.create()

        // add the game to all games
        currentGames[this.id] = this
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
        Engine.update(this.engine, 1000 / this.fps); // Update the Engine

        // Send informations to the players
        _.each( this.getPhysicalElementsOfType( "Player" ) ,(player)=>{
            player.socket.emit("gameUpdate", this.getGameUpdateInfos(player))
        })

    }

    /**
     * @method getPhysicalElementsOfType
     * @description Return all PhysicalElements of the specified type
     * @param {String} type
     * @returns {Array}
     */
    getPhysicalElementsOfType(type){
        let elements = []
        _.each( this.physicalElements , ( element )=>{
            if ( element.constructor.name === type )
                elements.push( element )

        } )
        console.log(elements)
        return elements
    }

    /***
     * @method getGameUpdateInfos
     * @description get all informations that have to be sent to a specific player
     * @param {Player} player player to whom the informations will be sent
     * @returns {{}}
     */
    getGameUpdateInfos(player){
        // TODO make the infos depend on the player to whom the infos will be given

        let gameUpdateInfos = {
            physicalElements : []
        }

        // add all PhysicalElements being in the Game
        _.each( this.physicalElements , ( physicalElement )=>{
            gameUpdateInfos.physicalElements.push({
                id: physicalElement.id,
                position: physicalElement.body.position
            })
        } )

        return gameUpdateInfos

    }

    /**
     * @method end
     * @description End the game
     */
    end() {

        // stop the main loop
        clearInterval(this.mainLoop)

        // remove the game
        delete currentGames[this.id]

    }

    /**
     * @method addPhysicalElement
     * @description Add a new PhysicalElement to the Game
     * @param {PhysicalElement} element
     */
    addPhysicalElement(element) {
        // add the PhysicalElement to physicalElements array
        this.physicalElements.push(element);

        // add the player physically to the world of the game
        World.add(this.engine.world, element.body);

    }

    /**
     * @method deletePhysicalElement
     * @description Delete a PhysicalElement from the Game
     * @param PhysicalElement element
     */
    deletePhysicalElement(element) {

        // remove the player from the players array
        // TODO WRONG
        delete this.physicalElements[element.id]

        // remove the player physically from the world of the game
        World.remove(this.engine.world, element.body, true);
    }

}

module.exports = Game;

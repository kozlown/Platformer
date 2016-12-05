/**
 * Created by Nigel on 26/11/2016.
 */
let Ground = require("./Ground.js")

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
        this.physicalElements = []

        let validName = true

        // Check if a game with this name doesn't already exists
        _.each( currentGames , ( value , index , array )=>{
            if ( value.name === name )
            {
                validName = false
            }
        })

        if (!validName) return false

        // create the engine of the game
        this.engine = Engine.create()

        // load the map
        this.loadMap(map)

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
        _.each( this.getPhysicalElementsOfType( "Player" ) ,(player)=>{

            player.move()

        })

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
            physicalElements: [],
            cameraPosition: {}
        }

        gameUpdateInfos.playerPosition = {
            x: -player.body.position.x,
            y: -player.body.position.y
        }

        // add all PhysicalElements being in the Game
        _.each( this.physicalElements , ( physicalElement )=>{

            gameUpdateInfos.physicalElements.push({
                id: physicalElement.id,
                type: physicalElement.constructor.name,
                position: physicalElement.body.position,
                width: physicalElement.width,
                height: physicalElement.height
            })

        })

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

        // remove the element from the element's array
        this.physicalElements = _.reject(this.physicalElements, (value)=>{
            return value.id === element.id
        })

        // remove the element physically from the world of the game
        World.remove(this.engine.world, element.body, true);
    }

    /**
     * @method loadMap
     * @description load a map
     * @param {String} map
     */
    loadMap( map ){

        map = JSON.parse(fs.readFileSync(`./game/maps/${map}.map`,{
            encoding: 'utf8'
        })).map

        // Add all elements to the game
        _.each( map , ( value , index , array )=>{

            switch ( value.type ){
                case "Ground":
                    console.log(value.position.x , value.position.y , value.width , value.height)
                    this.addPhysicalElement( new Ground( value.position.x , value.position.y , value.width , value.height ) )
                    break
            }

        })



    }

    static getCurrentGamesInfos(){
        let currentGamesInfos = []
        _.each(Object.keys(currentGames), (value, index, array) => {
            currentGamesInfos.push({
                id: value,
                name: currentGames[value].name,
                players: (() => {
                    let retour = []
                    _.each(currentGames[value].physicalElements, (value, index, array) => {
                        console.log(value.constructor.name)
                        if (value.constructor.name === "Player") {
                            retour.push({
                                name: value.name
                            })
                        }
                    })

                    return retour
                })()
            })
        })
        return currentGamesInfos
    }
}

module.exports = Game;
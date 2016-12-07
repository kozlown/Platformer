/**
 * Created by Nigel on 26/11/2016.
 */
let GroundJumpable = require("./GroundJumpable")
let GroundNotJumpable = require("./GroundNotJumpable")
let Respawn = require( './Respawn' );

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
    constructor(name, map) {

        this.id = uniqid()
        this.name = name
        this.positionableElements = []
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

        /**
         * handle all collisions
         */
        // Handle all start collisions
        Events.on(this.engine, "collisionStart", (e)=>{

            _.each( e.pairs , ( value , index , array )=>{

                let physicalElement1 = this.getPhysicalElementFromBody(value.bodyA)
                let physicalElement2 = this.getPhysicalElementFromBody(value.bodyB)

                if (physicalElement1 && physicalElement2){
                    physicalElement1.handleCollisionStartWith(physicalElement2)
                    physicalElement2.handleCollisionStartWith(physicalElement1)
                }
            })
        })
        // Handle all active collisions
        Events.on(this.engine, "collisionActive", (e)=>{

            _.each( e.pairs , ( value , index , array )=>{

                let physicalElement1 = this.getPhysicalElementFromBody(value.bodyA)
                let physicalElement2 = this.getPhysicalElementFromBody(value.bodyB)

                if (physicalElement1 && physicalElement2){
                    physicalElement1.handleCollisionActiveWith(physicalElement2)
                    physicalElement2.handleCollisionActiveWith(physicalElement1)
                }
            })
        })
        // Handle all ended collisions
        Events.on(this.engine, "collisionEnd", (e)=>{

            _.each( e.pairs , ( value , index , array )=>{

                let physicalElement1 = this.getPhysicalElementFromBody(value.bodyA)
                let physicalElement2 = this.getPhysicalElementFromBody(value.bodyB)

                if (physicalElement1 && physicalElement2){

                    physicalElement1.handleCollisionEndWith(physicalElement2)
                    physicalElement2.handleCollisionEndWith(physicalElement1)
                }
            })
        })

        // greater gravity
        this.engine.world.gravity.y = 3

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
        this.mainLoop = setInterval(this.step.bind(this), 1000/60);
        this.delta = 1000/60
        this.lastStepTimestamp = new Date().getTime()
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
        this.lastDelta = this.delta
        let delta = new Date().getTime() - this.lastStepTimestamp

        // only usefull because of the mistake in Matter.Body.update first lign, should be corrected
        this.delta = Math.sqrt(Math.pow(1000/60,2) * ( delta / (1000/60) ))

        Engine.update(this.engine, this.delta , this.delta / this.lastDelta); // Update the Engine

        // Send informations to the players
        _.each( this.getPhysicalElementsOfType( "Player" ) ,(player)=>{
            player.socket.emit("gameUpdate", this.getGameUpdateInfos(player))
        })

        this.lastStepTimestamp = new Date().getTime()
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

        // add the PhysicalElement physically to the world of the game
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
                case "GroundJumpable":
                    console.log(value.position.x , value.position.y , value.width , value.height)
                    this.addPhysicalElement( new GroundJumpable( value.position.x , value.position.y , value.width , value.height ) )
                    break
                case "GroundNotJumpable":
                    console.log(value.position.x , value.position.y , value.width , value.height)
                    this.addPhysicalElement( new GroundNotJumpable( value.position.x , value.position.y , value.width , value.height ) )
                    break
                case "Respawn":
                    this.addPositionableElement( new Respawn( value.position.x, value.position.y ))
                    break
            }

        })



    }

    /**
     * @method getPhysicalElementFromBody
     * @description get the game physical element's id corresponding with the specified body
     * @param {Body} body
     */
    getPhysicalElementFromBody( body ){

        let returnPhysicalElement=false

        _.each( this.physicalElements , ( value , index , array )=>{

            if (value.body.id === body.id){
                returnPhysicalElement = value
            }
        })

        return returnPhysicalElement
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

    /**
     * @method handleCollision
     * @description handler that will be called for every collision pairs
     * @param {PhysicalElement} physicalElement1
     * @param {PhysicalElement} physicalElement2
     */
    handleCollision( physicalElement1, physicalElement2 ){

        physicalElement1.handleCollisionWith( physicalElement2 )
        physicalElement2.handleCollisionWith( physicalElement1 )

    }

    /**
     * @method addPositionableElement
     * @description add a positionableElement to the game positionable elements array
     */
    addPositionableElement( positionableElement ){

        this.positionableElements.push( positionableElement )
    }

    /**
     * @method getPositionableElementsOfType
     * @description Return all PositionableElements of the specified type
     * @param {String} type
     * @returns {Array}
     */
    getPositionableElementsOfType(type){
        let elements = []
        _.each( this.positionableElements , ( element )=>{
            if ( element.constructor.name === type )
                elements.push( element )

        } )
        return elements
    }
}

module.exports = Game;
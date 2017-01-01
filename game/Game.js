/**
 * Created by Nigel on 26/11/2016.
 */
let GroundJumpable = require("./PositionableElements/PhysicalElements/GroundJumpable")
let GroundNotJumpable = require("./PositionableElements/PhysicalElements/GroundNotJumpable")
let PhysicalElement = require("./PositionableElements/PhysicalElements/PhysicalElement")
let Respawn = require('./PositionableElements/Respawn');
let Player = require('./PositionableElements/PhysicalElements/Player')
let Runner = require('./PositionableElements/Runner')
let Zombie = require('./PositionableElements/Zombie')
let Camera = require('./PositionableElements/PhysicalElements/Camera')

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
    constructor(name) {
        // set the state of the game to "loading"
        this.state = "loading"
        this.id = uniqid()
        console.log("new game: "+ this.id)
        this.name = name
        this.elements = []

        // create the engine of the game
        this.engine = Engine.create()

        /**
         * handle all collisions
         */
        // Handle all start collisions
        Events.on(this.engine, "collisionStart", (e)=>{

            let pairs = e.pairs
            for ( let i=0, size=e.pairs.length; i<size; i++ ){

                let value = pairs[i]
                let element1 = this.getElementFromBody(value.bodyA)
                let element2 = this.getElementFromBody(value.bodyB)

                if (element1 && element2){
                    element1.handleCollisionStartWith(element2)
                    element2.handleCollisionStartWith(element1)
                }

            }

        })
        // Handle all active collisions
        Events.on(this.engine, "collisionActive", (e)=>{

            let pairs = e.pairs
            for ( let i=0, size=e.pairs.length; i<size; i++ ){

                let value = pairs[i]
                let element1 = this.getElementFromBody(value.bodyA)
                let element2 = this.getElementFromBody(value.bodyB)

                if (element1 && element2){
                    element1.handleCollisionActiveWith(element2)
                    element2.handleCollisionActiveWith(element1)
                }
            }

        })
        // Handle all ended collisions
        Events.on(this.engine, "collisionEnd", (e)=>{

            let pairs = e.pairs
            for ( let i=0, size=e.pairs.length; i<size; i++ ){

                let value = pairs[i]
                let element1 = this.getElementFromBody(value.bodyA)
                let element2 = this.getElementFromBody(value.bodyB)

                if (element1 && element2){
                    element1.handleCollisionEndWith(element2)
                    element2.handleCollisionEndWith(element1)
                }
            }

        })

        // greater gravity
        this.engine.world.gravity.y = 3

        // set the state of the game to "ready"
        this.state = "ready"

    }

    /**
     * @method start
     * @description Start the game
     */
    start() {
        // if the game is not ready or paused, exit
        if (!(this.state === "ready" || this.state === "paused")) return

        this.delta = 1000/60
        this.lastStepTimestamp = new Date().getTime()

        // set the state of the game to "playing"
        this.state = "playing"

        // update points every second
        this.scoresUpdater = setInterval(this.updateScores.bind(this), 1000)

        // start step
        this.step()
    }

    /**
     * @method step
     * @description Go to the next state of the game
     */
    step(){
        let startStepTime = new Date().getTime()
        /**
         * Game & Engine Update
         */
        // if the game is not playing, exit
        if (this.state !== "playing") {
            return
        }

        // set the last time delta
        this.lastDelta = this.delta
        // set the new time delta
        let delta = new Date().getTime() - this.lastStepTimestamp
        // update the Engine
        calculationTimer.start()
        Engine.update(this.engine, this.delta , this.delta / this.lastDelta);
        calculationTimer.stop()

        /**
         * Move players & Send Update to players
         */

        // send informations to the players
        sendingTimer.start()
        // get every player and zombies
        let players = this.getElementsOfType( Player )
        for ( let i=0, size = players.length; i<size; i++ ){
            let player = players[i]
            player.move()
            player.socket.emit("gameUpdate", this.getGameUpdateInfos(player))

        }
        sendingTimer.stop()
        /**
         * Get current step duration
         */
        let endStepTime = new Date().getTime()
        let stepTime = endStepTime-startStepTime

        /**
         * Set next step Timeout
         */
        // set lastStepTimestamp
        this.lastStepTimestamp = new Date().getTime()
        // if (stepTime < fps)
        if ( stepTime < 1000/60 ) {
            // set the timeout for next step to (fps - stepTime)
            setTimeout(this.step.bind(this), 1000/60 - stepTime)
        } else {
            // else call directly the step
            this.step()
        }
    }

    /***
     * @method getGameUpdateInfos
     * @description get all informations that have to be sent to a specific player
     * @param {Player} player player to whom the informations will be sent
     * @returns {{}}
     */
    getGameUpdateInfos(player){

        let gameUpdateInfos = {
            id: this.id,
            physicalElements: []
        }

        gameUpdateInfos.playerPosition = {
            x: -player.body.position.x,
            y: -player.body.position.y
        }

        let cameras = this.getElementsOfType( Camera )
        let camera
        for ( let i=0, size = cameras.length; i<size; i++ ){

            camera = cameras[i]
            camera.position.x = player.body.position.x
            camera.position.y = player.body.position.y
           
        }

        // add all PhysicalElements being in the Game and in the field of vision of the player
        let physicalElements = this.getElementsOfType( PhysicalElement )
        for ( let i=0, size = physicalElements.length; i<size; i++ ){

            let element = physicalElements[i]
            let isInsideFieldOfVision = false

            // If the physicalElement is not a camera
            if (!(element instanceof Camera)){
                // Check if the physicalElement "collide" with the camera,
                isInsideFieldOfVision = PhysicalElement.collision(element, camera)

            }
            else {
                isInsideFieldOfVision = true
            }

            // if the physicalElement is inside the field of vision
            if (isInsideFieldOfVision){
                gameUpdateInfos.physicalElements.push({
                    id: element.id,
                    type: element.constructor.name,
                    position: element.body ? element.body.position : element.position,
                    width: element.width,
                    height: element.height,
                    score: element.socket ? element.socket.score : null,
                    rank: element.socket ? element.socket.rank : null
                })
            }

        }

        return gameUpdateInfos

    }

    /**
     * @method end
     * @description End the game
     */
    end() {

       this.state = "ended"

    }

    /**
     * @method addElement
     * @description Add a new element to the Game
     * @param {Element} element
     */
    addElement(element) {

        // add the Element to elements array
        this.elements.push(element);

        // if the element is a physicalElement
        if (element instanceof PhysicalElement && element.body) {
            // add it physically to the world
            World.add(this.engine.world, element.body);
        }
    }

    /**
     * @method deleteElement
     * @description Delete an Element from the Game
     * @param {Element} element
     */
    deleteElement(element) {

        // remove the element from the element's array
        this.elements = _.reject(this.elements, (value)=>{
            return value.id === element.id
        })

        // if the element is a physicalElement
        if (element instanceof PhysicalElement && element.body) {
            // remove it physically from the world
            World.remove(this.engine.world, element.body, true);
        }
    }

    /**
     * @method loadMap
     * @description load a map
     * @param {String} map
     * @return true if the map exists, else false
     */
    loadMap( map ){

        // if the file doesn't exist
        if (!fs.existsSync(`./game/maps/${map}.map`)){
            return false
        }

        map = JSON.parse(fs.readFileSync(`./game/maps/${map}.map`,{
            encoding: 'utf8'
        })).map

        // Add all elements to the game
        for ( let i=0, size = map.length; i<size; i++ ){

            let value = map[i]
            switch ( value.type ){
                case "GroundJumpable":
                    this.addElement( new GroundJumpable( value.position.x , value.position.y , value.width , value.height ) )
                    break
                case "GroundNotJumpable":
                    this.addElement( new GroundNotJumpable( value.position.x , value.position.y , value.width , value.height ) )
                    break
                case "Respawn":
                    this.addElement( new Respawn( value.position.x, value.position.y ))
                    break
                case "Camera":
                    this.addElement( new Camera( 0, 0, value.width, value.height ))
            }

        }

        return true

    }

    /**
     * @method getElementFromBody
     * @description get the game element's id corresponding with the specified body
     * @param {Body} body
     */
    getElementFromBody( body ){

        let returnElement=false

        let elements = this.elements
        for ( let i=0, size = elements.length; i<size; i++ ){

            let value = elements[i]
            if (value instanceof PhysicalElement && value.body)
            if (value.body.id === body.id){
                return value
            }

        }
    }

    /**
     * @method handleCollision
     * @description handler that will be called for every collision pairs
     * @param {Element} element1
     * @param {Element} element2
     */
    handleCollision( element1 , element2 ){

        element1.handleCollisionWith( element2 )
        element2.handleCollisionWith( element1 )

    }

    /**
     * @method getElementsOfType
     * @description Return all elements of the specified type
     * @param {Object} type
     * @returns {Array}
     */
    getElementsOfType(type){
        let returnElements = []
        let elements = this.elements
        for ( let i=0, size=elements.length; i<size; i++ ){

            let element = elements[i]
            if ( element instanceof type )
                returnElements.push( element )

        }
        return returnElements
    }

    /**
     * @method updateScores
     * @description update the scores of the players in the game
     */
    updateScores(  ){

        let zombies = this.getElementsOfType(Zombie),
            runners = this.getElementsOfType(Runner),
            players = this.getElementsOfType(Player)

        for ( let i=0, size=zombies.length; i<size; i++ ){

            let value = zombies[i]
            // decrease score by 1%
            value.socket.score -= _.floor(value.socket.score / 100)

        }

        for ( let i=0, size=runners.length; i<size; i++ ){

            let value = runners[i]
            // increase in score by 10 points
            value.socket.score += 10

        }

        this.updateRanks()

        let rankingInfos = _.map(this.getElementsOfType(Player), (player)=>{
            return {
                name: player.name,
                score: player.socket.score,
                rank: player.socket.rank,
            }
        })

        for ( let i=0, size=players.length; i<size; i++ ){

            let value = players[i]
            value.socket.emit('rankingInfos', rankingInfos )

        }

    }
    
    /**
     * @method updateRanks
     * @description update ranks of all players
     */
    updateRanks(  ){

        let orderedPlayers = _.orderBy(this.getElementsOfType(Player), [(player)=>{return player.socket.score}], ["desc"])
        for ( let i=0, size = orderedPlayers.length; i<size; i++ ){

            let value = orderedPlayers[i]
            value.socket.rank = i+1

        }
    
    }
}

module.exports = Game;
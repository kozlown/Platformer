/**
 * Created by Nigel on 26/11/2016.
 */
let GroundJumpable = require("./GroundJumpable")
let GroundNotJumpable = require("./GroundNotJumpable")
let PhysicalElement = require("./PhysicalElement")
let Respawn = require('./Respawn');
let Player = require('./Player')
let Runner = require('./Runner')
let Zombie = require('./Zombie')
let Camera = require('./Camera')

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

            _.each( e.pairs , ( value , index , array )=>{

                let element1 = this.getElementFromBody(value.bodyA)
                let element2 = this.getElementFromBody(value.bodyB)

                if (element1 && element2){
                    element1.handleCollisionStartWith(element2)
                    element2.handleCollisionStartWith(element1)
                }
            })

        })
        // Handle all active collisions
        Events.on(this.engine, "collisionActive", (e)=>{

            _.each( e.pairs , ( value , index , array )=>{

                let element1 = this.getElementFromBody(value.bodyA)
                let element2 = this.getElementFromBody(value.bodyB)

                if (element1 && element2){
                    element1.handleCollisionActiveWith(element2)
                    element2.handleCollisionActiveWith(element1)
                }
            })

        })
        // Handle all ended collisions
        Events.on(this.engine, "collisionEnd", (e)=>{

            _.each( e.pairs , ( value , index , array )=>{

                let element1 = this.getElementFromBody(value.bodyA)
                let element2 = this.getElementFromBody(value.bodyB)

                if (element1 && element2){
                    element1.handleCollisionEndWith(element2)
                    element2.handleCollisionEndWith(element1)
                }
            })

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

        // get the start step time
        let startStepTime = new Date().getTime()

        /**
         * Game & Engine Update
         */
        // if the game is not playing, exit
        if (this.state !== "playing") {
            return
        }
        // else
        // get every player and zombies
        let players = this.getElementsOfType( Player )
        // move them
        _.each( players ,(player)=>{
            player.move()
        })
        // set the last time delta
        this.lastDelta = this.delta
        // set the new time delta
        let delta = new Date().getTime() - this.lastStepTimestamp
        // update the Engine
        Engine.update(this.engine, this.delta , this.delta / this.lastDelta);
        // set the end of calculation time
        let endCalculationTime = new Date().getTime()

        /**
         * Send Update to players
         */
        // send informations to the players
        _.each( players ,(player)=>{
            player.socket.emit("gameUpdate", this.getGameUpdateInfos(player))
        })
        let endSendingTime = new Date().getTime()

        /**
         * Display performance statistics
         */
        if ((endSendingTime - endCalculationTime + endCalculationTime - startStepTime)>1000/60){
            console.log(`Calculation time: ${endCalculationTime - startStepTime}`)
            console.log(`Sending time: ${endSendingTime - endCalculationTime}`)
        }

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
            physicalElements: []
        }

        gameUpdateInfos.playerPosition = {
            x: -player.body.position.x,
            y: -player.body.position.y
        }

        let camera
        _.each( this.getElementsOfType( Camera ) , ( value , key , collection )=>{

            value.position.x = player.body.position.x
            value.position.y = player.body.position.y
            camera = value

        })
        // add all PhysicalElements being in the Game and in the field of vision of the player
        _.each( this.getElementsOfType( PhysicalElement ), ( element )=>{
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
                    score: element.socket ? element.socket.score : null
                })
            }
        })

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
        _.each( map , ( value , index , array )=>{

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

        })
        return true

    }

    /**
     * @method getElementFromBody
     * @description get the game element's id corresponding with the specified body
     * @param {Body} body
     */
    getElementFromBody( body ){

        let returnElement=false

        _.each( this.elements , ( value , index , array )=>{

            if (value instanceof PhysicalElement && value.body)
            if (value.body.id === body.id){
                returnElement = value
            }
        })

        return returnElement
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
        let elements = []
        _.each( this.elements , ( element )=>{
            if ( element instanceof type )
                elements.push( element )

        } )
        return elements
    }

    /**
     * @method updateScores
     * @description update the scores of the players in the game
     */
    updateScores(  ){

        _.each( this.getElementsOfType(Zombie) , ( value , key , collection )=>{

            // decrease score by 1%
            value.socket.score -= _.floor(value.socket.score / 100)
            console.log(value.name+ " : "+value.socket.rank + " : "+value.socket.score)
        })

        _.each( this.getElementsOfType(Runner) , ( value , key , collection )=>{

            // increase in score by 10 points
            value.socket.score += 10
            console.log(value.name+ " : "+value.socket.rank + " : "+value.socket.score)
        })

        this.updateRanks()
    }
    
    /**
     * @method updateRanks
     * @description update ranks of all players
     */
    updateRanks(  ){
    
        _.each( _.orderBy(this.getElementsOfType(Player), [(player)=>{return player.socket.score}], ["desc"]) , ( value , key , collection )=>{
            
            value.socket.rank = key+1
        })
    
    }
}

module.exports = Game;
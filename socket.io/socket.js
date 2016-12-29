var Game = require('../game/Game');
var PhysicalElement = require('../game/PositionableElements/PhysicalElements/PhysicalElement')
var Player = require('../game/PositionableElements/PhysicalElements/Player');
var Runner = require('../game/PositionableElements/Runner');
var Zombie = require('../game/PositionableElements/Zombie');
var Ground = require('../game/PositionableElements/PhysicalElements/Ground');
var Respawn = require('../game/PositionableElements/Respawn');


module.exports = ( () => {

    return (socket) => {

        socket.on(`login`, (playerInfos) => {
            // set the last action timestamp
            socket.lastActionTimestamp = new Date().getTime()
            // check every second if the last action was made in the last minute
            // if not, disconnect the player
            socket.checkActive = setInterval(()=> {
                let durationBeforeDisconnection = _.floor((60000 - (new Date().getTime() - socket.lastActionTimestamp))/1000)
                if (durationBeforeDisconnection <= 10){
                    // if the player was playing and the game exists
                    if (socket.player.gameId && gamesManager.getGame(socket.player.gameId)) {
                        // tell him the duration before his disconnection
                        socket.emit("durationBeforeDisconnection", (durationBeforeDisconnection))
                    }
                }
                if (durationBeforeDisconnection < 0){
                    // if the player was playing and the game exists
                    if (socket.player.gameId && gamesManager.getGame(socket.player.gameId)) {
                        // he is disconnected from the game
                        gamesManager.getGame(socket.player.gameId).deleteElement(socket.player)
                    }

                    clearInterval(socket.checkActive)
                    // tell the player he's disconnected
                    socket.emit(`disconnected`);
                }
            }, 1000)
            // create a new player linked with the socket
            socket.player =
                new Player(
                    playerInfos.name,
                    playerInfos.x,
                    playerInfos.y,
                    playerInfos.width,
                    playerInfos.height,
                    socket
                )

            console.log(`${socket.player.name} is connected`)

            // tell the player that the login worked
            socket.emit(`connected`)

            // send current games to the player
            socket.emit(`currentGames`, gamesManager.getGamesInfos())

            /**
             * He's connected so he can play
             */
            socket.on(`logout`, () => {

                // if the player was playing and the game exists
                if (socket.player.game && gamesManager.getGame(socket.player.game.id)) {
                    // he is disconnected from the game
                    gamesManager.getGame(socket.player.game.id).removePlayer(socket.player)
                }

                // tell the player he's disconnected
                socket.emit(`disconnected`);

            });

            socket.on(`keydown`, (keyCode) => {
                // set the last action timestamp
                socket.lastActionTimestamp = new Date().getTime()
                switch (keyCode) {

                    /**
                     * Left
                     */
                    case 37:
                        socket.player.state.isMovingLeft = true
                        break

                    /**
                     * Right
                     */
                    case 39:
                        socket.player.state.isMovingRight = true
                        break

                    /**
                     * Jump
                     */
                    case 38:
                        socket.player.state.wantsToJump = true
                        socket.player.jump()
                        break

                }

            })

            socket.on(`keyup`, (keyCode) => {
                // set the last action timestamp
                socket.lastActionTimestamp = new Date().getTime()
                switch (keyCode) {

                    /**
                     * Left
                     */
                    case 37:
                        socket.player.state.isMovingLeft = false
                        break

                    /**
                     * Right
                     */
                    case 39:
                        socket.player.state.isMovingRight = false
                        break

                    /**
                     * Jump
                     */
                    case 38:
                        socket.player.state.wantsToJump = false
                }

            })

            socket.on(`newGame`, (gameInfos) => {

                let game = new Game(gameInfos.name)

                if (game.loadMap(gameInfos.map) && gamesManager.addGame(game)) { // if the game was successfully added

                    // send current games to everybody
                    let gamesInfos = gamesManager.getGamesInfos()

                    socket.emit('currentGames', gamesInfos)
                    socket.broadcast.emit('currentGames', gamesInfos)
                }

            })

            socket.on(`joinGame`, (gameId) => {
                // set the last action timestamp
                socket.lastActionTimestamp = new Date().getTime()

                // initialise the score of the player
                socket.score = 100

                // if the game doesn't exist, exit
                let gameToJoin = gamesManager.getGame(gameId)
                if (!gameToJoin) return

                // Check if the player is already in a game
                let isPlayerAlreadyInAGame = false
                _.each(gamesManager.games, (game, index, array) => {
                    _.each(game.getElementsOfType(Player), (player, index, array) => {
                        if (player.id === socket.player.id) {
                            isPlayerAlreadyInAGame = game.id
                        }
                    })
                })
                // set the socket gameID
                socket.gameId = gameId

                // if he's in a game then make him exit this game
                if (isPlayerAlreadyInAGame) {
                    gamesManager.getGame(isPlayerAlreadyInAGame).deleteElement(socket.player)
                }

                // determine if the player should be a Zombie or a Runner
                // if there are more Runners than Zombies
                if (gameToJoin.getElementsOfType(Runner).length > gameToJoin.getElementsOfType(Zombie).length){
                    // the new Player is a Zombie
                    socket.player = new Zombie(socket.player)
                }
                // else
                else {
                    // the new Player is a Runner
                    socket.player = new Runner(socket.player)
                }

                // set his position to a random respawn point of the game
                let respawns = gameToJoin.getElementsOfType(Respawn)
                let respawn = respawns[_.random(0, respawns.length - 1)]
                socket.player.setPosition(respawn.position.x, respawn.position.y)

                // make him join the game
                gameToJoin.addElement(socket.player)

                // he get the infos so he can display the map
                socket.emit("gameJoined", gameToJoin.getGameUpdateInfos(socket.player))

            })

            socket.on(`startGame`, (gameId) => {
                // set the last action timestamp
                socket.lastActionTimestamp = new Date().getTime()

                let gameToStart = gamesManager.getGame(gameId)

                // if the game doesn't exist, exit
                if (!gameToStart) return

                // else, start the game
                gameToStart.start()

            })

        });
    }

} );
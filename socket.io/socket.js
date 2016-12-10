var Game = require( '../game/Game' );
var PhysicalElement = require('../game/PhysicalElement')
var Player = require( '../game/Player' );
var Zombie = require( '../game/Zombie' );
var Ground = require( '../game/Ground' );
var Respawn = require( '../game/Respawn' );

module.exports = ( ()=>{

    return (socket) => {

        socket.on(`login`, ( playerInfos ) => {

            // create a new player linked with the socket
            socket.player =
                new Player (
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

        });

        socket.on(`logout`, () => {

            // if the player was playing and the game exists
            if (socket.player.game && gamesManager.getGame(socket.player.game.id)){
                // he is disconnected from the game
                gamesManager.getGame(socket.player.game.id).removePlayer(socket.player)
            }

            // tell the player he's disconnected
            socket.emit(`disconnected`);

        });

        socket.on(`keydown`, ( keyCode ) => {

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
                    socket.player.jump()
                    break
            }

        })

        socket.on(`keyup`, ( keyCode ) => {

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

            }

        })

        socket.on(`newGame`, ( gameInfos ) => {

            let game = new Game(gameInfos.name, gameInfos.map)
            if (gamesManager.addGame(game)) { // if the game was successfully added

                // send current games to everybody
                let gamesInfos = gamesManager.getGamesInfos()

                socket.emit('currentGames', gamesInfos)
                socket.broadcast.emit('currentGames', gamesInfos)
            }

        })

        socket.on(`joinGame`, ( gameId )=>{
            let gameToJoin = gamesManager.getGame(gameId)

            // if the game doesn't exist, exit
            if (!gameToJoin) return

            /**
             * Check if the player is already in a game
             */
            let isPlayerAlreadyInAGame = false
            _.each( gamesManager.games , ( game , index , array )=>{
                _.each( game.getElementsOfType( Player ) , ( player , index , array )=>{
                    if (player.id === socket.player.id){
                        isPlayerAlreadyInAGame = game.id
                    }
                })
            })

            /**
             * if he's in a game then make him exit this game
             */
            if (isPlayerAlreadyInAGame){
                gamesManager.getGame(isPlayerAlreadyInAGame).deleteElement(socket.player)
            }

            /**
             * set his position to a random respawn point of the game
             */
            let respawns = gameToJoin.getElementsOfType( Respawn )
            let respawn = respawns[_.random(0, respawns.length-1)]
            socket.player.setPosition(respawn.position.x, respawn.position.y)

            /**
             * make him join the game
             */
            gameToJoin.addElement( socket.player )
            socket.player.gameId = gameId

            // he get the infos so he can display the map
            socket.emit("newGame",  gameToJoin.getGameUpdateInfos(socket.player))

            /**
             * Send new current games infos to the players
             */
            let gamesInfos = gamesManager.getGamesInfos()

            socket.emit('currentGames', gamesInfos)
            socket.broadcast.emit('currentGames', gamesInfos)

        } )

        socket.on(`becomeZombie`, (  )=>{

            let gameId = socket.player.gameId
            gamesManager.getGame(gameId).deleteElement(socket.player)
            gamesManager.getGame(gameId).addElement(new Zombie(socket.player))

        })

        socket.on(`startGame`, ( gameId )=>{
            let gameToStart = gamesManager.getGame(gameId)

            // if the game doesn't exist, exit
            if (!gameToStart) return

            // else, start the game
            gameToStart.start()

        } )
    }

} );
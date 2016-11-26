var Game = require('../game/Game');
var Player = require('../game/Player');
var Ground = require('../game/Ground');

module.exports = (()=>{

    return ((socket)=>{

        socket.on('login', function ( data ) {

            // create a new player linked with the socket
            socket.player = new Player( data.name , data.x , data.y , data.width , data.height , socket )

            // tell the player that the login worked
            socket.emit(`connected`)

            // send current games to the player
            socket.emit(`currentGames`,Object.keys(currentGames))

        });


        socket.on(`logout`, ()=>{

            // if the player was playing, he leaves the game
            if ( socket.player.game != null )
                currentGames[ socket.player.game ].removePlayer( socket.player )

            socket.emit(`disconnected`);

        });


        socket.on(`keydown`,( data )=>{

            console.log(`key down : ${ data }`)

        })


        socket.on("keyup",( data )=>{

            console.log(`key up : ${data}`)

        })


        socket.on(`newGame`,( data )=>{

            let game = new Game( data.name , data.fps , [socket.player.name] , data.map )
            if (game){ // if the creation worked
                game.addPlayer(socket.player)
                currentGames[game.name] = game
                socket.emit('currentGames',Object.keys(currentGames)) // send current games to the player
                socket.broadcast.emit('currentGames',Object.keys(currentGames)) // send current games to all others players
                return
            }
            socket.emit("newGame", false)

        })

        socket.on(`joinGame`,( data )=>{

            currentGames[data].addPlayer(socket.player)

        })

        socket.on("startGame",(data)=>{

            currentGames[data].start()

        })
    })
});
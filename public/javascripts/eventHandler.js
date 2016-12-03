Game = require("./Game.js")
$ = require("jquery")
_ = require("underscore")
io = require('socket.io-client')
socket = io('http://localhost:3000'); // set the socket

game = null
/**
@description SOCKET CONNECTION
 */
{
    socket.emit("login", {
        name: "Nigel"+Math.random(),
        x: 100,
        y: 100,
        width: 50,
        height: 50
    }) // try to login

    socket.on('connected', (data) => { // when connected
        console.log("connected")
        socket.emit("newGame",{fps:60,name:"testGame",map:"map1"})
    })

    socket.on('disconnected', (data) => { // when disconnected
        console.log("disconnected")
    })
}



/**
 @description SOCKET EVENTS HANDLERS
 */
{

    socket.on('currentGames', (data) => { // when receiving informations about the current games

        console.log(`current games : `, data)

    })

    socket.on('newGame', (data) => { // when receiving informations the new game creation

        console.log("new game : ", data )
        game = new Game( $( window ).width() , $( window ).height() , "#renderer" , data )
        socket.on('gameUpdate', game.update.bind(game))

    })

}



/**
@description KEYS HANDLER
 */
{

    let keysDown = new Set() // all keys down
    let eventZone = $(document) // set the zone where events trigger

    eventZone.on("keydown", (e) => {

        if (!keysDown.has(e.which)) {

            keysDown.add(e.which)
            socket.emit("keydown", e.which)
            //console.log(keysDown)

        }

    })

    eventZone.on("keyup", (e) => {

        if (keysDown.has(e.which)) {

            keysDown.delete(e.which)
            socket.emit("keyup", e.which)
            //console.log(keysDown)

        }

    })

}


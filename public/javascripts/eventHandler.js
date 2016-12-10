Game = require("./Game.js")
jQuery = require("jquery")
$ = jQuery
require('bootstrap')
_ = require("lodash")
io = require('socket.io-client')
configs = require("../../configs/front.conf")
socket = io(`http://${configs.domain}:${configs.port}`); // set the socket


game = null
/**
@description SOCKET CONNECTION
 */
{
    socket.emit("login", {
        name: `Guest (${Math.random()})`,
        x: 0,
        y: 0,
        width: 50,
        height: 50
    }) // try to login

    socket.on('connected', (data) => { // when connected

        console.log("connected");
        $('#newGame .create').click(()=>{

            socket.emit("newGame",{name:$("#newGame .name").val(),map:$("#newGame .map").val()})
        })
    })

    socket.on('disconnected', (data) => { // when disconnected
        console.log("disconnected")
    })
}



/**
 @description SOCKET EVENTS HANDLERS
 */
{

    // when receiving informations about the current games
    socket.on('currentGames', (data)=>{

        $( "#games .game" ).remove()
        _.each( data , ( value , index , array )=>{

            let gameId = value.id
            // title - join - start
            $( "#games" ).append( `<div class="game" id="${gameId}"><span class="name">${value.name}</span>`
                    + `<a  class="btn btn-lg btn-outline" onclick="socket.emit('joinGame','${value.id}')">Join !</a>`
                    + `<a  class="btn btn-lg btn-outline" onclick="socket.emit('startGame','${value.id}')">Start !</a></div>`)

            // players
            $( `#${gameId}` ).append("<div class='players'></div>")
            _.each( value.players , ( value , index , array )=>{

                $( `#${gameId} .players` ).append(`<div class="player"><span>${value.name}</span></div>`)

            })
        })
    })

    socket.on('newGame', (data) => { // when receiving informations the new game creation

        if (game){
            game.destroy()
        }
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
        /**
         * Menu
         */
        if (e.keyCode == 27){
            $('#menu').toggle()
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


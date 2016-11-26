let socket = io('http://localhost:3000'); // set the socket

/*
SOCKET CONNECTION
 */
{
    socket.emit("login", {
        name: "Nigel"+Math.random(),
        x: 0,
        y: 0,
        width: 100,
        height: 100
    }) // try to login

    socket.on('connected', (data) => { // when connected
        console.log("connected")
    })

    socket.on('disconnected', (data) => { // when disconnected
        console.log("disconnected")
    })
}



/*
 SOCKET EVENTS HANDLERS
 */
{
    socket.on('currentGames', (data) => { // when receiving informations about the current games
        console.log(`current games : `, data)
    })

    socket.on('newGame', (data) => { // when receiving informations the new game creation
        console.log(data)
    })

    socket.on('gameUpdate', gameUpdate)
}



/*
KEYS HANDLER
 */
{
    let keysDown = new Set() // all keys down
    let eventZone = $(document) // set the zone where events trigger

    eventZone.on("keydown", (e) => {
        if (!keysDown.has(e.which)) {
            keysDown.add(e.which)
            socket.emit("keydown", e.which)
            console.log(keysDown)
        }
    })
    eventZone.on("keyup", (e) => {
        if (keysDown.has(e.which)) {
            keysDown.delete(e.which)
            socket.emit("keyup", e.which)
            console.log(keysDown)
        }
    })
}
require("dotenv").config()
const path = require("path")
const express = require("express");
const app = express()
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors:"http://localhost:3000"
});
const cors = require("cors")

app.use(cors())

app.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

/** Manage behavior of each client socket connection */
io.on('connection', (socket) => {
  console.log(`User Connected - Socket ID ${socket.id}`)

  // Store the room that the socket is connected to
  // If you need to scale the app horizontally, you'll need to store this variable in a persistent store such as Redis.
  // For more info, see here: https://github.com/socketio/socket.io-redis
  let currentRoom = null

  /** Process a room join request. */
  socket.on('JOIN', (roomName) => {
    // Get chatroom info
    let room = io.sockets.adapter.rooms.get(roomName)

    // Reject join request if room already has more than 1 connection
    if (room && room.size > 1) {
      // Notify user that their join request was rejected
      io.to(socket.id).emit('ROOM_FULL', roomName)

      // Notify room that someone tried to join
      socket.broadcast.to(roomName).emit('INTRUSION_ATTEMPT', roomName)
    } else {
      // Leave current room
      socket.leave(currentRoom)

      // Notify room that user has left
      socket.broadcast.to(currentRoom).emit('USER_DISCONNECTED', null)

      // Notify user of room join success io.to(socket.id)
      socket.emit("ROOM_LEFT", currentRoom)

      // Join new room
      currentRoom = roomName
      socket.join(currentRoom);


      console.log(io.sockets.adapter.rooms);
      // console.log(io.sockets.adapter.rooms.size);
      // console.log(socket.adapter.rooms.get(roomName).size)
      // console.log(socket.adapter.rooms.get(roomName))
      // console.log(socket.adapter.rooms.size)
      // console.log("\n\n")

      // Notify user of room join success io.to(socket.id)
      socket.emit('ROOM_JOINED', currentRoom)
      
      // Notify room that user has joined
      socket.broadcast.to(currentRoom).emit('NEW_CONNECTION', null)
    }
  })

  /** Broadcast a received message to the room */
  socket.on('MESSAGE', (msg) => {
    console.log(`New Message - ${msg}`)
    socket.broadcast.to(currentRoom).emit('MESSAGE', msg)
  })

  /** Broadcast a new publickey to the room */
  socket.on('PUBLIC_KEY', (key) => {
    socket.broadcast.to(currentRoom).emit('PUBLIC_KEY', key)
  })

  /** Broadcast a disconnection notification to the room */
  socket.on('disconnect', () => {
    console.log("Disconnected" + socket.id)
    socket.broadcast.to(currentRoom).emit('USER_DISCONNECTED', null)
  })
})


const PORT = process.env.PORT || 8080

http.listen(PORT, ()=>{console.log(`Listening on ${PORT}`)})














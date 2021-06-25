import ChatArea from "./Components/ChatArea/ChatArea";
import InfoArea from "./Components/InfoArea/InfoArea";
import UtilsArea from "./Components/UtilsArea/UtilsArea";
import JoinRoom from "./Components/JoinRoom/JoinRoom";
import React, {useRef, useEffect, useState} from 'react';
import { Helmet } from 'react-helmet'
import socket from "./Utils/socket";
import "./CSS/App.css";

const { ECDH } = require("./Utils/ECDH");

function App() {

  console.log("Rendering.... APP")

  const ecdh = useRef(new ECDH());

  const [room, setRoom] = useState(socket.id)

  const [info, setInfo] = useState(["", "", false])

  const [status, setStatus] = useState([])

  const addStatus = (content)=>{
    setStatus((STATUS)=>[
        ...STATUS, content
    ]) 
  }

  // On Mounting
  useEffect(()=>{

    socket.on("NEW_CONNECTION", ()=>{
      socket.emit("PUBLIC_KEY", ecdh.current.getPublicKey())
      addStatus(`Sent your public Key`)
      addStatus(`NEW USER JOINED`)
    })
  
    socket.on("ROOM_JOINED", (room)=>{
      addStatus(`SUCCESSFULLY JOINED : ${room}`)
      addStatus(`Sent your public Key : ${ecdh.current.getPublicKey()}`)
      socket.emit("PUBLIC_KEY", ecdh.current.getPublicKey())
    })
  
    socket.on("PUBLIC_KEY", (publicKey)=>{
      console.log("PUBLIC KEY")
      setInfo([publicKey, ecdh.current.getSecretKey(publicKey), true])
      addStatus(`Public Key Received : ${publicKey}`)
    })
  
    socket.on("USER_DISCONNECTED", ()=>{
      console.log("USER DISCONNCTED")
      setInfo(["", "", false])
      addStatus(`USER DISCONNECTED`)
    })

    socket.on("ROOM_LEFT", (room)=>{
      addStatus(`You Left ${room}`)
    })
  
    socket.on("ROOM_FULL", (room)=>{
        console.log("ROOM FULL")
        addStatus(`${room} is FULL!! Please Try another Room`)
    })
  
    socket.on('INTRUSION_ATTEMPT', (room)=>{
        console.log("INTRUSION ATTEMPTED")
        addStatus(`Intruder tried to join`)
    })

  }, [])


  const joinRoom  = (roomName)=>{
    if(roomName===room){
      addStatus(`You are already in ${roomName}`)
      return
    }
    else{
      setRoom(roomName)
      setInfo(["", "", false])
      socket.emit("JOIN", roomName)
    }
  }

  return (
    <div className="container">
      {/* For Title of Page */}
      <Helmet>
          <title>One-to-One-E2EE-Chat-App</title>
      </Helmet>
      <div className="left">
        <ChatArea ecdh={ecdh.current} friendOnline={info[2]}/>
      </div>  
      <div className="right">
        <JoinRoom joinRoom={(event) => {
            joinRoom(event)
          }}/>
        <InfoArea status={status}/>
        <UtilsArea ecdh={ecdh.current} secretKey={info[1]} friendPublicKey={info[0]}/>
      </div>
    </div>
  );
}

export default App;

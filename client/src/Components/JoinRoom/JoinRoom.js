import React from 'react'
import "./JoinRoom.css"
import FileCopyIcon from '@material-ui/icons/FileCopy';
// const {uuid} = require("uuidv4")
import { v4 as uuid_v4 } from "uuid";

export default function JoinRoom({joinRoom}) {

    console.log("Rendering.... JOINROOM")

    const handleSubmit = (e)=>{
        e.preventDefault();
        let roomName = document.getElementById("roomName").value;
        if(roomName==="") return 
        joinRoom(roomName)
    }

    const generateCode = ()=>{
        const code = uuid_v4()
        document.getElementById("roomName").value = code;
    }

    const copyRoomCode = ()=>{
        let copyText = document.getElementById("roomName");
        copyText.select();
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy");
        alert("Copied Room Code : " + copyText.value);
      }

    return (
        <>
        <div id="join_box" title="You can create your code manually">
            <form onSubmit={(e)=>{
                handleSubmit(e)
            }}>
                <button type="submit">JOIN ROOM</button>
                <input id="roomName" type="text" placeholder="Enter Room Code"/>
            </form>
            <button id="copy_icon" onClick={copyRoomCode}><FileCopyIcon/></button>
        </div>
        <button id="generate_code" onClick={generateCode}>GENERATE  CODE</button>
        </>
    )
}

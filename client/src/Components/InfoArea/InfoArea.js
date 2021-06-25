import React from 'react'
// import socket from '../../Utils/socket'
import "./InfoArea.css"

export default function InfoArea({status}) {

    console.log("Rendering.... INFO")

    const showStatus = status.map((Status, index)=>{
        return <p key={index}>{Status}</p>
    })

    // const scrollDown = ()=>{
    //     document.getElementById("message_box").scrollTop = document.getElementById("message_box").scrollHeight;
    // }


    return (
        <div  className="info_area">
            <div id="info_navbar">
                <button id="info_header">STATUS INFO</button>
            </div>
            <div id="info">
                {showStatus}
            </div>
        </div>
    )
}

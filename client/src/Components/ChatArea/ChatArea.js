import React, {useState} from 'react'
import socket from "../../Utils/socket"
import "./ChatArea.css"

export default function ChatArea({ecdh, friendOnline}) {

    console.log("Rendering.... CHAT")

    const [encrypted, setEncrypted] = useState(false)
    const [buttonText, setButtonText] = useState("Encrypted")
    const [messages, setMessages] = useState([])
    const [encryptedMessages, setEncyptedMessages] = useState([])

    const toogleEncrypted = ()=>{
        if(encrypted){
            setEncrypted(false)
            setButtonText("Encrypted")
        }else{
            setEncrypted(true)
            setButtonText("Decrypted")
        }
    }

    const scrollDown = ()=>{
        document.getElementById("message_box").scrollTop = document.getElementById("message_box").scrollHeight;
    }

    let messageContent = "";
    let ref;

    const getContent = (e)=>{
        messageContent =  e.target.value
        ref = e
    }

    const onMessage = (e, content)=>{
        
        if(friendOnline===false){
            alert("No User Connected")
            return
        }

        e.preventDefault();

        if(content==="") return
        
        ref.target.value = ""
        
        console.log(content)
        let encryptedMessage = ecdh.encryptMessage(content)
        console.log(encryptedMessage)
        socket.emit("MESSAGE", encryptedMessage)
        
        setEncyptedMessages((Messages)=>[
            ...Messages,
            {content:encryptedMessage, fromSelf: true},
        ]);

        setMessages((Messages) => [
            ...Messages,
            {content, fromSelf: true },
        ]);

        scrollDown()
    }


    
    const showMessages = (encrypted)=>{
        let MESSAGES = (encrypted===true)?encryptedMessages:messages; 
        return MESSAGES.map((message, index)=>{
            if(message.fromSelf === true){
                return (
                    <div
                      key={index}
                      className="chat__message sender_message"
                    >
                      {message.content}
                      <span className="chat__time">{new Date().toUTCString()}</span>
                    </div>
                  );
            }
            if(message.fromSelf===false){
                return (
                    <div
                      key={index}
                      className="chat__message receiver_message"
                    >
                      {message.content}
                      <span className="chat__time">{new Date().toUTCString()}</span>
                    </div>
                  ); 
            }
            else{return null}
            }
        )
    }
    
    socket.on("MESSAGE", (content)=>{
        console.log(content)
        console.log(typeof(content))
        let decryptedMessage = ecdh.decryptMessage(content)
        console.log(decryptedMessage)
        let messagesList = [...messages, {content:decryptedMessage, fromSelf:false}];
        setMessages(messagesList);
        messagesList = [...encryptedMessages, {content, fromSelf:false}];
        setEncyptedMessages(messagesList)
    })


    return (
        <div className="chat_area">
            <div id="chat_navbar">
            <a href=""><button id="chat_leave_chat">LEAVE CHAT</button></a>
                <button id="change_text" title="See Encryped and Decrypted Messages" onClick={toogleEncrypted}>{buttonText}</button>
            </div>
            <div id="message_box">
                {showMessages(encrypted)}
            </div>
            <form id="form" onSubmit={(e)=>{onMessage(e,messageContent)}}>
                <input id="message" type="text" placeholder="Enter Message" onChange={(e) => getContent(e)}/>
                <button id="submit" type="submit">Send</button>
            </form>
        </div>
    )
}

import React from 'react'
import "./UtilsArea.css"

export default function UtilsArea({ecdh, secretKey, friendPublicKey}) {

    console.log("Rendering.... UTILS")

    return (
        <div className="utils_area">
            <div id="utils_navbar">
                <button id="utils_header">UTILS INFO</button>
            </div>
            <div id="utils">
                <p className="keys">Your Public Key : {ecdh.getPublicKey()}</p>
                <p className="keys">Your Private Key : {ecdh.getPrivateKey()}</p>
                <p className="keys">Your Friends Public Key : {friendPublicKey}</p>
                <p className="keys">Secret Key : {secretKey}</p>
            </div>
        </div>
    )
}

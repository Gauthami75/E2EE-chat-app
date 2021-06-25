import { io } from "socket.io-client"
// const URL = "http://localhost:8080";
const URL = "https://web-chat-e2ee.herokuapp.com/"

const socket = io(URL, { autoConnect: true});

export default socket;
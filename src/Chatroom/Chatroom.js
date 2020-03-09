import React, { useEffect, useState } from 'react';
import './Chatroom.css'


function Chatroom({ setRoomID, roomID, chat, socket, updateChat, setUsername, username, ...props }) {
    const [roomInfo, setRoomInfo] = useState(["empty"])
    useEffect(() => {
        ready()
        return () => {
            socket.emit('leave', { username: username, roomID: roomID });
            console.log("unmount")
            socket.removeAllListeners()
        }
    }, [])
    //let url = window.location.href
    //let roomID = url.substring(url.length - 1, url.length);

    function ready() {
        //initial
        socket.removeAllListeners()
        socket.emit("join", { username: username, roomID: roomID })
        socket.on("roomInfo", function (message) {

            setRoomInfo(message.userList);
        })
        socket.on("system", function (message) {
            document.getElementById("userCount").innerHTML = "Online user count:" + message.onlineCount + " ;"
        })
        socket.on("broadcast", function (newMessage) {
            console.log("broadcast")
            updateChat(prev => !prev ? [newMessage] : [...prev, newMessage])
            //scoll to bottom when new message comes
            document.getElementById('chat-messsages').lastChild.scrollIntoView(false)



        })
    }
    function handleSubmit(e) {
        e.preventDefault();
        //let url = window.location.href
        //let roomID = url.substring(url.length - 1, url.length);
        let text = document.getElementById("inputMessage").value;
        socket.emit("chat", { username: username, text: text, roomID: roomID });
        document.getElementById("inputMessage").value = ""
        console.log("submit")

    }


    let messageCount = 0
    let messages = <div></div>
    if (!chat) { messages = "" } else
        messages = chat.map(message => {
            messageCount++
            return message.username !== "admin" ?
                <div
                    className={message.username === username ? "ownMsg" : "othersMsg"}
                    key={messageCount}>{`${message.username} says: ${message.text}`}
                </div>
                :
                <div className="adminMsg" key={messageCount}>{`${message.user.username} ${message.join ? "joined" : "leaved"}`}</div>



        })


    return (
        <>
            <div className="chatRoom">
                <div>Welcome, you are in room {`${roomID}`}</div>
                <div className="roomInfo">
                    <div>Users List: {roomInfo.toString()}</div>

                </div>


                <div id="chat-messsages">{messages}</div>


            </div>
            <form onSubmit={handleSubmit}>


                <label>Text</label>
                <input id="inputMessage"></input>
                <input type="submit" value="Submit"></input>
            </form>
            <button onClick={() => {
                setRoomID("0")
                if (chat) { updateChat(prev => { prev.length = 0; console.log("leave") }) }
                props.history.push('/')
            }}>leave</button>
            <button onClick={() => { if (chat) { updateChat(prev => { prev.length = 0; console.log("clear") }) } }
            }>clear</button>
        </>
    )
}

export default Chatroom;
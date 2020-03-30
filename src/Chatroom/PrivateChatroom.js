import React, { useEffect } from 'react';
//import './PrivateChatroom.css'
import InputBox from '../Common/InputBox'

function PrivateChatroom({ chatRecord, setRoomID, roomID, chat, socket, updateChat, setChatRecord, accountInfo, chatTargetInfo, ...props }) {
    let username = accountInfo.username
    useEffect(() => {
        ready()

        return () => {
            socket.emit('leave', { username: username, roomID: roomID });
            console.log("unmount")
            socket.removeAllListeners()
        }
    }, [])

    function ready() {
        //initial
        socket.removeAllListeners()
        socket.emit("joinPrivateChat", { roomID: roomID })
        let allmsg = chatRecord[roomID].msg || []
        let allmsgTemp = []
        for (let i = 0; i < allmsg.length; i++) {
            allmsgTemp.push({
                username: allmsg[i].talker,
                text: allmsg[i].content
            })
        }

        updateChat(allmsgTemp)

        socket.on("broadcast", function (newMessage) {
            console.log("broadcast")
            updateChat(prev => !prev ? [newMessage] : [...prev, newMessage])
            //scoll to bottom when new message comes
            document.getElementById('chat-messsages').lastChild.scrollIntoView(false)
        })
        socket.on("chatRecordUpdate", (res) => {
            console.log("chatRecordUpdate")
            setChatRecord(res.chatRecord)
            socket.emit("markMsgRead")
        })
    }
    function handleSubmit(e) {
        e.preventDefault();
        let content = document.getElementById("inputMessage").value;
        socket.emit("chat", { text: content, username: username });
        document.getElementById("inputMessage").value = ""
        console.log("submit")

    }

    let messageCount = 0
    let messages = <div></div>
    if (!chat) { messages = "" } else
        messages = chat.map(message => {
            if (message.username === "admin") { return }
            messageCount++
            return <div
                className={message.username === username ? "msg ownMsg" : "msg othersMsg"}
                key={messageCount}>
                {message.username !== username && <div style={{ color: "blue" }}>{message.username}</div>}
                <div>{message.text}</div>

            </div>
        })

    return (
        <>
            <div className="chatRoomName">
                <div className="iconImg inChatRoom" style={{ backgroundImage: `url(${chatTargetInfo.icon})` }}></div>
                <div>
                    {chatTargetInfo.username}
                </div>
            </div>
            <div className="chatRoom">
                <div id="chat-messsages">{messages}</div>
            </div>
            <InputBox handleSubmit={handleSubmit} />
        </>
    )
}

export default PrivateChatroom;
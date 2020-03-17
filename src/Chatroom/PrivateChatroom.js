import React, { useEffect } from 'react';
//import './PrivateChatroom.css'


function PrivateChatroom({ chatRecord, setRoomID, roomID, chat, socket, updateChat, setChatRecord, accountInfo, ...props }) {
    let username = accountInfo.username
    let fdRoomList = accountInfo.fdRooms
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
            updateChat(prev => !prev ? [newMessage] : [...prev, newMessage])
            //scoll to bottom when new message comes
            document.getElementById('chat-messsages').lastChild.scrollIntoView(false)
        })
        socket.on("chatRecordUpdate", (res) => {
            console.log("chatRecordUpdate")
            setChatRecord(res.chatRecord)
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
            messageCount++
            return <div
                className={message.username === username ? "ownMsg" : "othersMsg"}
                key={messageCount}>{`${message.username} says: ${message.text}`}
            </div>

        })


    return (
        <>
            <div className="chatRoom">
                <div>Welcome, you are in room {`${roomID}`}</div>
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
        </>
    )
}

export default PrivateChatroom;
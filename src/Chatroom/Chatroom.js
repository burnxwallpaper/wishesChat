import React, { useEffect, useState } from 'react';
import './Chatroom.css'
import InputBox from '../Common/InputBox'
import Popup from '../Common/Popup'


function Chatroom({ setRoomID, roomID, chat, socket, updateChat, accountInfo, allUsersIcon, ...props }) {
    const [roomInfo, setRoomInfo] = useState(["empty"])
    let username = accountInfo.username
    useEffect(() => {
        ready()
        return () => {
            socket.emit('leave', { username: username, roomID: roomID });
            console.log("unmount")
            //socket.removeAllListeners()
        }
    }, [])
    function ready() {
        //initial
        updateChat(prev => prev.length = 0)
        socket.removeAllListeners()
        socket.on('disconnect', () => {
            if (socket.disconnect) Popup()
        })
        socket.emit("join", { username: username, roomID: roomID })
        socket.on("roomInfo", function (message) {
            let room = []
            message.userList.map((username) => {
                let user = {}
                user.username = username
                user.iconImage = allUsersIcon[username]
                room.push(user)
            })
            setRoomInfo(room);
        })
        socket.on("system", function (message) {
            document.getElementById("userCount").innerHTML = "Online user count:" + message.onlineCount + " ;"
        })
        socket.on("broadcast", function (newMessage) {
            console.log("broadcast")
            updateChat(prev => !prev ? [newMessage] : [...prev, newMessage])
            //scoll to bottom when new message comes
            if (document.getElementById('chat-messsages')) {
                document.getElementById('chat-messsages').lastChild.scrollIntoView(false)
            }

        })
    }
    function handleSubmit(e) {
        e.preventDefault();
        let text = document.getElementById("inputMessage").value;
        socket.emit("chat", { username: username, text: text, roomID: roomID });
        document.getElementById("inputMessage").value = ""
        console.log("submit")

    }
    function addFriend(username) {
        socket.emit("fdRequestSent", { username: username })
    }

    let messageCount = 0
    let messages = <div></div>
    if (!chat) { messages = "" } else
        messages = chat.map(message => {
            messageCount++
            return message.username !== "admin" ?
                <div
                    className={message.username === username ? "msg ownMsg" : "msg othersMsg"}
                    key={messageCount}>
                    {message.username !== username && <div style={{ color: "blue" }}>{message.username}</div>}
                    <div>{message.text}</div>
                </div>
                :
                <div className="adminMsg" key={messageCount}>{`${message.user.username} ${message.join ? "joined" : "leaved"}`}</div>
        })

    let defaultIcon = "https://www.pngfind.com/pngs/m/93-938050_png-file-transparent-white-user-icon-png-download.png"
    return (
        <>
            <div className="chatRoomName">
                <div id="hoverPull" className="hoverPull" onClick={() => {
                    let listClassList = document.getElementById("userListInChatRoom").classList
                    if (listClassList.contains("translateX100")) {
                        listClassList.remove("translateX100")
                        document.getElementById("hoverPull").classList.remove("clicked")
                    }
                    else {
                        document.getElementById("hoverPull").classList.add("clicked")
                        listClassList.add("translateX100")
                    }
                }}>
                    <div>{`Room: ${roomID}`}</div>
                    <i className="fas fa-users "></i>
                    Users
                </div>
            </div>
            <div className="chatRoom publicChatRoom">
                <div id="userListInChatRoom" className="userList inChatRoom">
                    {roomInfo.map(
                        (user) => {
                            let { username, iconImage } = user
                            return (
                                <div id={`user-${username}`} key={`userInRm-${username}`} className="user">
                                    <img className="iconImg othersIcon" alt="userIcon" src={`${iconImage || defaultIcon}`}></img>
                                    <div>{username}
                                        {!accountInfo.friends.includes(username) && accountInfo.username !== username
                                            && username !== "遊客" && accountInfo.username !== "遊客"
                                            && <i onClick={() => addFriend(username)} className="fas fa-user-plus"></i>}
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <div id="chat-messsages">{messages}</div>
            </div>
            <InputBox handleSubmit={handleSubmit} />
        </>
    )
}

export default Chatroom;
import React, { useEffect } from 'react';
import './LobbyPage.css';
import { render } from "react-dom";
import CreateRoom from './CreateRoom'


function LobbyPage({ setChatRecord, setAccountInfo, setRoomID, socket, accountInfo, chatRecord, setOnlineUsers, onlineUsers, ...props }) {
    let username = accountInfo.username
    function redirect(roomID, privateRoom = false) {
        setRoomID(roomID)
        privateRoom ?
            props.history.push('/privateroom') :
            props.history.push('/room')
    }
    function addFriend(username) {
        socket.emit("fdRequestSent", { username: username })
    }

    function acceptFriend(username) {
        socket.emit("fdRequestAccept", { username: username })
    }

    function findRoomId(fdusername) {
        let targetRoomID
        for (let [roomID, roomInfo] of Object.entries(chatRecord)) {
            if (roomInfo.roomType === "private" && roomInfo.users.includes(username) && roomInfo.users.includes(fdusername)) {
                targetRoomID = roomID
                break
            }
        }
        return targetRoomID
    }

    useEffect(() => {
        socket.emit("requestRoomInfo")
        socket.on("roomListUpdate", function (roomList) {
            let location = document.getElementById("roomList")
            let newRoomBtnGroup
            newRoomBtnGroup = Object.keys(roomList.roomInfo).map((roomID) => {
                return <div id={`room${roomID}`} key={`room${roomID}`} className="roombtn" onClick={() => redirect(roomID)}>
                    <div>Room {roomID}</div>
                    <div>Host:{roomList.roomHost[roomID]}</div>
                    <div>Users Count:{roomList.roomInfo[roomID].length}</div>
                </div>
            })
            render(newRoomBtnGroup, location);
        })
        socket.emit("requestUserListInfo")
        socket.on("userListUpdate", function (res) {
            setOnlineUsers(res.usernameList)
        })
        socket.on("chatRecordUpdate", (res) => {
            console.log("chatRecordUpdate")
            console.log(res.chatRecord)
            setChatRecord(res.chatRecord)
        })
        socket.on("updateAccountInfo", (req) => {
            setAccountInfo(req.accountInfo)
        })
        socket.on("newFdRequest", (req) => { console.log(req.requestor + " want to add you") })
        socket.on("newFdAccept", (req) => { console.log(req.acceptor + " added you") })

        return () => { socket.removeAllListeners(); console.log("unmount lobby") }
    }, [])

    return (
        <div id="lobbyPage" className="LobbyPage">
            <div id="userList" className="userList">
                <div id="allUserList">
                    <div>Online Users:</div>
                    {onlineUsers.map(
                        (username) => {
                            return <div id={`user-${username}`} key={`user-${username}`} className="user">
                                <div>{username}
                                    {username !== accountInfo.username && <button onClick={() => addFriend(username)}>Add</button>}
                                </div>


                            </div>
                        })}
                </div>
                <div id="friendList">
                    <div>Friends:</div>
                    <div id="onlineFrinedList" className="onlineFriendContainer">
                        <div>Online:</div>
                        {accountInfo.friends.map((username) => {
                            if (onlineUsers.includes(username))
                                return <div id={`onlineFriend-${username}`} key={`onlineFriend-${username}`} className="onlineFriend">
                                    <div>{username}</div>
                                    <button onClick={() => redirect(findRoomId(username), true)}>chat</button>
                                </div>
                        })}
                    </div>
                    <div id="offlineFrinedList" className="offlineFriendContainer">
                        <div>Offline:</div>
                        {accountInfo.friends.map((username) => {
                            if (!onlineUsers.includes(username))
                                return <div id={`offlineFriend-${username}`} key={`offlineFriend-${username}`} className="offlineFriend">
                                    <div>{username}</div>
                                    <button onClick={() => redirect(findRoomId(username), true)}>chat</button>
                                </div>
                        })}
                    </div>
                    <div id="fdRequestReceived">
                        <div>fdRequestReceived:</div>
                        {accountInfo.fdRequestReceived.map((username) => {
                            return <div id={`fdRequestReceived-${username}`} key={`fdRequestReceived-${username}`}>
                                {username}
                                <button onClick={() => acceptFriend(username)}>Acccept</button>
                            </div>
                        })}
                    </div>
                    <div id="fdRequestSent">
                        <div>fdRequestSent:</div>
                        {accountInfo.fdRequestSent.map((username) => {
                            return <div id={`fdRequestSent-${username}`} key={`fdRequestSent-${username}`}>
                                {username}
                            </div>
                        })}
                    </div>
                </div>

            </div>

            <div id="roomList"></div>
            <div className="createBtn" onClick={() => CreateRoom(setRoomID, props, socket, username)}>Create</div>

        </div>
    )
}

export default LobbyPage
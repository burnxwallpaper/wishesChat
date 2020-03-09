import React, { useEffect } from 'react';
import './LobbyPage.css';
import { render } from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect,
    Link
} from "react-router-dom";
import CreateRoom from './CreateRoom'
import { set } from 'mongoose';

function LobbyPage({ setRoomID, socket, username, setFriendList, friendList, setOnlineUsers, onlineUsers, ...props }) {
    function redirect(roomID) {
        setRoomID(roomID)
        props.history.push('/room')
    }
    function addFriend(username) {
        socket.emit("sendFriendRequest", { username })
    }

    useEffect(() => {
        socket.emit("requestRoomInfo")
        socket.on("roomListUpdate", function (roomList) {
            let location = document.getElementById("roomList")
            let newRoomBtnGroup
            newRoomBtnGroup = Object.keys(roomList.roomInfo).map((roomID) => {
                console.log(roomList.roomInfo[roomID])
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
            if (res.friendList) setFriendList(res.friendList)
            setOnlineUsers(res.usernameList)



            /*let allUserListLocation = document.getElementById("allUserList")
            let friendListLocation = document.getElementById("onlineFrinedList")
            let fdList = []
            let allUserList = res.usernameList.map((username) => {
                return <div id={`user-${username}`} key={`user-${username}`} className="user">
                    <div>{username}</div>
                </div>
            })
            if (res.friendList) {
                fdList = res.friendList.map((username) => {
                    return <div id={`friend-${username}`} key={`friend-${username}`} className="friend">
                        <div>{username}</div>
                    </div>
                })
            }
            allUserList.unshift(<div>Online Users:</div>)
            fdList.unshift(<div>Friends:</div>)
            render(allUserList, allUserListLocation);
            render(fdList, friendListLocation);*/
        })

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
                                <div>{username}</div>
                            </div>
                        })}
                </div>
                <div id="friendList">
                    <div>Friends:</div>
                    <div id="onlineFrinedList" className="onlineFriendContainer">
                        <div>Online:</div>
                        {friendList.map((username) => {
                            if (onlineUsers.includes(username))
                                return <div id={`onlineFriend-${username}`} key={`onlineFriend-${username}`} className="onlineFriend">
                                    <div>{username}</div>
                                </div>
                        })}
                    </div>
                    <div id="offlineFrinedList" className="offlineFriendContainer">
                        <div>Offline:</div>
                        {friendList.map((username) => {
                            if (!onlineUsers.includes(username))
                                return <div id={`offlineFriend-${username}`} key={`offlineFriend-${username}`} className="offlineFriend">
                                    <div>{username}</div>
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
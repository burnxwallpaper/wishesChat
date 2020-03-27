import React, { useEffect } from 'react';
import './LobbyPage.css';
import SuccessNotify from '../Common/SuccessNotify'
import MainLobby from './MainLobby'
import Friends from './Friends'
import SettingPage from './SettingPage'


function LobbyPage({ setChatRecord, setRoomList, setCurrentPage, currentPage, fdListWithIcon, setChatTargetInfo,
    setAllUsersIcon, allUsersIcon,
    roomList, setAccountInfo, setRoomID, socket, accountInfo, chatRecord, setOnlineUsers, onlineUsers, ...props }) {
    let username = accountInfo.username

    function redirect(roomID, privateRoom = false, fdInfo = {}) {
        setRoomID(roomID)
        if (privateRoom) {
            setChatTargetInfo(fdInfo)
            props.history.push('/privateroom')
        } else { props.history.push('/room') }
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
            console.log("roomListUpdate")
            setRoomList(roomList)
        })
        socket.emit("requestUserListInfo")
        socket.on("userListUpdate", function (res) {
            console.log("userListUpdate")
            if (res.allUsersIcon) setAllUsersIcon(res.allUsersIcon)
            setOnlineUsers(res.usernameList)
        })
        socket.on("chatRecordUpdate", (res) => {
            console.log("chatRecordUpdate")
            console.log(res.chatRecord)

            setChatRecord(res.chatRecord)
        })
        socket.on("updateAccountInfo", (req) => {
            console.log("updateAccountInfo")
            setAccountInfo(req.accountInfo)
        })
        socket.on("newFdRequest", (req) => { console.log(req.requestor + " want to add you") })
        socket.on("newFdAccept", (req) => { console.log(req.acceptor + " added you") })
        socket.on("systemMsg", (res) => {
            console.log(res.msg)
            SuccessNotify(res.msg)
        })
        return () => { socket.removeAllListeners(); console.log("unmount lobby") }
    }, [])

    return (
        <div id="lobbyPage" className="LobbyPage">


            {currentPage === "mainLobby" ?
                <MainLobby roomList={roomList} findRoomId={findRoomId} acceptFriend={acceptFriend} addFriend={addFriend}
                    redirect={redirect} accountInfo={accountInfo} onlineUsers={onlineUsers} fdListWithIcon={fdListWithIcon}
                    socket={socket} props={props} setRoomID={setRoomID} allUsersIcon={allUsersIcon}
                /> :
                currentPage === "friends" ?
                    <div className="friendPage"><Friends accountInfo={accountInfo} fdListWithIcon={fdListWithIcon} redirect={redirect} findRoomId={findRoomId} chatRecord={chatRecord} /></div>
                    : <SettingPage socket={socket} accountInfo={accountInfo} />
            }



        </div>
    )
}

export default LobbyPage
import React from 'react';
import CreateRoom from './CreateRoom'
function MainLobby({ socket, allUsersIcon, roomList, setRoomID, props, redirect, accountInfo, onlineUsers, findRoomId, acceptFriend, addFriend }) {
    let newRoomGroup
    let defaultIcon = "https://www.pngfind.com/pngs/m/93-938050_png-file-transparent-white-user-icon-png-download.png"
    if (!roomList) { newRoomGroup = <></> }
    else newRoomGroup = Object.keys(roomList.roomInfo).map((roomID) => {
        return <div id={`room${roomID}`} key={`room${roomID}`} className="roombtn" onClick={() => redirect(roomID)}>
            <div>Room {roomID}</div>
            <div>Host:{roomList.roomHost[roomID]}</div>
            <div>Users Count:{roomList.roomInfo[roomID].length}</div>
        </div>
    })
    return (
        <>
            <div id="userList" className="userList">
                <div className="hover-btn"><i className="fas fa-caret-right"></i></div>
                <div >
                    <div id="profileIcon" className="iconImg"
                        style={{ backgroundImage: `url(${(accountInfo && accountInfo.iconImage) || defaultIcon})` }}></div>
                    <div><h2>{accountInfo.username}</h2></div>
                </div>
                <div id="onlineUserTitle">Online Users:</div>
                <div id="allUserList">
                    <div className="onlineUserList">
                        {onlineUsers.map(
                            (username) => {
                                return <div id={`user-${username}`} key={`user-${username}`} className="user">
                                    {username === (accountInfo && accountInfo.username) ?
                                        <div className="iconImg othersIcon" style={{ backgroundImage: `url(${accountInfo.iconImage || defaultIcon})` }}></div>
                                        :
                                        <div className="iconImg othersIcon" style={{ backgroundImage: `url(${(allUsersIcon[username]) || defaultIcon})` }}></div>
                                    }

                                    <div>{username}
                                        {!accountInfo.friends.includes(username) && username !== "遊客" && accountInfo.username !== "遊客" && accountInfo.username !== username
                                            && <i onClick={() => addFriend(username)} className="fas fa-user-plus"></i>}
                                    </div>
                                </div>
                            })}
                    </div>
                </div>
            </div>
            <div className="roomList">
                <div className="createBtn" onClick={() => CreateRoom(setRoomID, props, socket, accountInfo.username)}>Create</div>
                {newRoomGroup}
            </div>
        </>
    )
}

export default MainLobby;

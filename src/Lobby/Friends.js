import React from 'react';
import './Friends.css';

function Friends({ accountInfo, fdListWithIcon, redirect, findRoomId, chatRecord }) {
    let defaultIcon = "https://www.pngfind.com/pngs/m/93-938050_png-file-transparent-white-user-icon-png-download.png"
    function findLastMsg(username, wantDate = false) {

        let roomID = findRoomId(username)

        if (chatRecord[roomID]) {
            let lastIndex = chatRecord[roomID].msg.length - 1


            let lastMsg;
            if (!chatRecord[roomID].msg[lastIndex]) { lastMsg = "" }
            else { lastMsg = chatRecord[roomID].msg[lastIndex].content }

            if (wantDate) {
                if (!chatRecord[roomID].msg[lastIndex]) { lastMsg = "" }
                else
                    lastMsg = chatRecord[roomID].msg[lastIndex].time.substring(0, 10)
            }

            return lastMsg
        }

    }
    function checkUnreadMsgCount(username) {
        let roomID = findRoomId(username)
        let count = 0
        if (chatRecord[roomID]) {


            for (let i = 0; i < chatRecord[roomID].msg.length; i++) {
                if (chatRecord[roomID].msg[i].talker === username && !chatRecord[roomID].msg[i].read) { count++ }
            }

        }
        return count

    }
    return (
        <div className="friendPage">

            {accountInfo.friends.map((username) => {
                let fdInfo = {
                    username: username,
                    icon: fdListWithIcon[username] || defaultIcon,
                }
                return <div id={`onlineFriend-${username}`} key={`onlineFriend-${username}`} className="eachfriend " onClick={() => redirect(findRoomId(username), true, fdInfo)}>
                    <div className="iconImg inFriendPage" style={{ backgroundImage: `url(${fdListWithIcon[username] || defaultIcon})` }}></div>
                    <div className="previewMsg">
                        <div >{username}</div>
                        <div className="lastMsg" >{findLastMsg(username)}</div>
                    </div>
                    {checkUnreadMsgCount(username) > 0 && <div className="unreadMsgCount">
                        {checkUnreadMsgCount(username)}
                    </div>}
                    <div className="lastMsgDate">
                        {findLastMsg(username, true)}
                    </div>
                </div>
            })}
            <button onClick={() => console.log(chatRecord)}>chatRecord</button>
        </div>
    )

}
export default Friends;
import React from 'react';
import './MailBox.css';
import freeze from '../Common/freeze'

function MailBox({ accountInfo, setMailBox, socket }) {
    function close() {
        freeze(false)
        setMailBox(false)
    }
    function acceptFriend(username) {
        socket.emit("fdRequestAccept", { username: username })
        console.log("fdRequestAccept")
    }
    freeze()
    return (
        <div id="MailBox">
            <button id="MailBoxclosBtn" onClick={() => close()}>X</button>
            <div className="MailBoxList">
                {accountInfo.fdRequestReceived.map((username) => {
                    return <div id={`fdRequestReceived-${username}`} key={`fdRequestReceived-${username}`} className="fdRequestReceived">
                        <div className="MailBoxAcceptFdName">{username}</div>
                        <button className="MailBoxAcceptFd" onClick={() => acceptFriend(username)}>Acccept</button>
                    </div>
                })}
                {accountInfo.fdRequestReceived.length === 0 && <div>You have 0 friend request</div>}
            </div>

        </div>
    )
}

export default MailBox
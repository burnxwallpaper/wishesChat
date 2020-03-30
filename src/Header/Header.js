import React, { useState } from 'react';
import './Header.css';
import { Link } from "react-router-dom";
import MailBox from './MailBox'
function Header({ setCurrentPage, updateChat, setRoomID, accountInfo, history, socket }) {
    const [mailBox, setMailBox] = useState(false)
    function setPage(page) {
        setRoomID("0")
        setCurrentPage(page)
        history.push('/')
    }

    return (
        <>
            {mailBox && <MailBox setMailBox={setMailBox} accountInfo={accountInfo} socket={socket} />}
            <div className="header">
                <div className="headerTitle">
                    <img src="https://image.flaticon.com/icons/svg/788/788856.svg" alt="whatsChat icon"></img>
                    WhatsChat
                    <div className="headerMail" onClick={() => { setMailBox(true) }}>
                        <div className="unreadMsgCount">{accountInfo.fdRequestReceived.length || 0}</div>
                    </div>
                </div>
                <div className="headerNavBar">
                    <Link className="nav-btn" to='/' onClick={() => setPage("friends")}>Friends</Link>
                    <Link className=" nav-btn" to='/' onClick={() => setPage("mainLobby")}>Lobby</Link>
                    <Link className=" nav-btn" to='/' onClick={() => setPage("SettingPage")}>Setting</Link>
                </div >
            </div >
        </>
    )
}
export default Header;
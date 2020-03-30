import React, { useState } from 'react';
import './App.css';
import {
  Switch,
  Route, Redirect, useHistory,
} from "react-router-dom";
import Chatroom from './Chatroom/Chatroom'
import PrivateChatroom from './Chatroom/PrivateChatroom'
import LobbyPage from './Lobby/LobbyPage'
import LoginPage from './LoginPage/LoginPage'
//import CreateAccountPage from './CreateAccountPage/CreateAccountPage'
import Header from './Header/Header'

function App() {
  const [socket, setSocket] = useState()
  const [accountInfo, setAccountInfo] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [chatRecord, setChatRecord] = useState([])
  const [roomID, setRoomID] = useState()
  const [roomList, setRoomList] = useState()
  const [currentPage, setCurrentPage] = useState("mainLobby")
  const [fdListWithIcon, setFdListWithIcon] = useState()
  const [allUsersIcon, setAllUsersIcon] = useState()
  const [chat, updateChat] = useState([])
  const [chatTargetInfo, setChatTargetInfo] = useState()
  const history = useHistory();
  //let devSer = "ws://localhost:4000"

  if (!socket) {
    console.log("connect socket")
    const io = require('socket.io-client')
    setSocket(io("https://wisheschatroomapi.herokuapp.com/"))
  }

  /*
  <Route path="/createaccount" render={(props) =>
              <CreateAccountPage {...props} socket={socket} />}
            />
  */
  return (

    <div className="App">
      <div>
        {accountInfo && <Header history={history} accountInfo={accountInfo} socket={socket}
          setCurrentPage={setCurrentPage} setRoomID={setRoomID} updateChat={updateChat} />}
        <Switch>

          <Route path="/login" render={(props) =>
            <LoginPage {...props} setAllUsersIcon={setAllUsersIcon} accountInfo={accountInfo}
              socket={socket} setAccountInfo={setAccountInfo} setChatRecord={setChatRecord} setFdListWithIcon={setFdListWithIcon} />}
          />
          {(!accountInfo) && <Redirect to={{ pathname: "/login", }} />}
          <Route exact path="/" render={(props) =>
            <LobbyPage {...props} setChatTargetInfo={setChatTargetInfo} allUsersIcon={allUsersIcon} setAllUsersIcon={setAllUsersIcon}
              setCurrentPage={setCurrentPage} currentPage={currentPage} fdListWithIcon={fdListWithIcon}
              setRoomList={setRoomList} roomList={roomList} setRoomID={setRoomID} socket={socket} accountInfo={accountInfo} setAccountInfo={setAccountInfo}
              onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers} chatRecord={chatRecord} setChatRecord={setChatRecord}
            />}
          />
          <Route path="/room" render={(props) =>
            <Chatroom {...props} allUsersIcon={allUsersIcon}
              setRoomID={setRoomID} roomID={roomID} chat={chat} socket={socket} updateChat={updateChat} accountInfo={accountInfo} />}
          />
          <Route path="/privateroom" render={(props) =>
            <PrivateChatroom {...props} chatTargetInfo={chatTargetInfo}
              setChatRecord={setChatRecord} chatRecord={chatRecord} setRoomID={setRoomID} roomID={roomID} chat={chat} socket={socket} updateChat={updateChat} accountInfo={accountInfo} />}
          />
          <Route render={() => <div>Page Not Found</div>} />
        </Switch>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect, useHistory,
  Link
} from "react-router-dom";
import Chatroom from './Chatroom/Chatroom'
import PrivateChatroom from './Chatroom/PrivateChatroom'
import LobbyPage from './Lobby/LobbyPage'
import LoginPage from './LoginPage/LoginPage'
import CreateAccountPage from './CreateAccountPage/CreateAccountPage'

function App() {
  const [socket, setSocket] = useState()
  const [accountInfo, setAccountInfo] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [chatRecord, setChatRecord] = useState([])
  const [roomID, setRoomID] = useState()
  const history = useHistory();
  if (!socket) {
    console.log("connect socket")
    const io = require('socket.io-client')
    setSocket(io("ws://localhost:4000"))
  }
  const [chat, updateChat] = useState([])

  useEffect(() => {
    console.log("login success")
  }, [accountInfo])



  return (

    <div className="App">
      <div className="login">
        <div id="userCount"></div>
        <Switch>
          <Route path="/createaccount" render={(props) =>
            <CreateAccountPage {...props} socket={socket} />}
          />
          <Route path="/login" render={(props) =>
            <LoginPage {...props} socket={socket} setAccountInfo={setAccountInfo} setChatRecord={setChatRecord} />}
          />
          {(!accountInfo) && <Redirect to={{ pathname: "/login", }} />}
          <Route exact path="/" render={(props) =>
            <LobbyPage {...props} setRoomID={setRoomID} socket={socket} accountInfo={accountInfo} setAccountInfo={setAccountInfo}
              onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers} chatRecord={chatRecord} setChatRecord={setChatRecord}
            />}
          />
          <Route path="/room" render={(props) =>
            <Chatroom {...props} setRoomID={setRoomID} roomID={roomID} chat={chat} socket={socket} updateChat={updateChat} accountInfo={accountInfo} />}
          />
          <Route path="/privateroom" render={(props) =>
            <PrivateChatroom {...props} setChatRecord={setChatRecord} chatRecord={chatRecord} setRoomID={setRoomID} roomID={roomID} chat={chat} socket={socket} updateChat={updateChat} accountInfo={accountInfo} />}
          />
          <Route render={() => <div>Page Not Found</div>} />
        </Switch>
      </div>
    </div>
  );
}

export default App;

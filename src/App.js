import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect, useHistory,
  Link
} from "react-router-dom";
import Chatroom from './Chatroom/Chatroom'
import LobbyPage from './Lobby/LobbyPage'
import LoginPage from './LoginPage/LoginPage'

function App() {
  const [socket, setSocket] = useState()
  const [username, setUsername] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [friendList, setFriendList] = useState([])
  const [roomID, setRoomID] = useState()
  const history = useHistory();
  if (!socket) {
    console.log("connect socket")
    const io = require('socket.io-client')
    setSocket(io("ws://localhost:4000"))
  }
  const [chat, updateChat] = useState([])

  useEffect((props) => {

    console.log(roomID)
  }, [roomID])



  return (

    <div className="App">
      <div className="login">
        <div id="userCount"></div>
        <Switch>

          <Route path="/login" render={(props) =>
            <LoginPage {...props} socket={socket} username={username} setUsername={setUsername} />}
          />
          {(!username) && <Redirect to={{ pathname: "/login", }} />}
          <Route exact path="/" render={(props) =>
            <LobbyPage {...props} setRoomID={setRoomID} socket={socket} username={username}
              onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers}
              setFriendList={setFriendList} friendList={friendList} />}
          />
          <Route path="/room" render={(props) =>
            <Chatroom {...props} setRoomID={setRoomID} roomID={roomID} chat={chat} socket={socket} updateChat={updateChat} setUsername={setUsername} username={username} />}
          />
          <Route render={() => <div>Page Not Found</div>} />
        </Switch>
      </div>
    </div>
  );
}

export default App;

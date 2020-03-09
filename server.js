const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 4000;
//db
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/chatroomAPI'
const db = mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const Account = require('./dbAPI/accountModel');
const accountRouter = require('./dbAPI/accountRouter')(Account);

//app.use(bodyParser.json());
/*app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true"
    //"Content-Type": "text/html"
  })
  next()
})*/

//app.use('/account', accountRouter);

app.get('/', function (req, res) {
  res.send('Hello World!');
});


//globle
let onlineUsers = {};
let usernameList = []
let onlineCount = 0

let roomInfo = {
  "1": [],
  "2": [],
  "3": []
};
let roomHost = {
  "1": "admin",
  "2": "admin",
  "3": "admin"
}
let userID = 0;
let times = 0

//start connect
io.on('connection', function (socket) {
  console.log("someone connected" + times)
  times++

  async function auth(username, password) {
    let res
    await Account.findOne({
      username: username
    }, function (err, user) {
      if (err) throw err
      if (!user) {
        console.log('Authenticate failed. User not found')
        res = false
      } else if (user) {
        if (user.password !== password) {
          console.log('Authenticate failed.  Wrong password')
          res = false
        } else {
          console.log('Auth success')
          res = true
        }
      }
    })
    return res
  }
  async function checkFriends(username) {
    let result
    await Account.findOne({ username: username }, function (err, user) {
      if (err) throw err
      if (!user) {
        console.log('User not found')
        result = false;
      } else {
        result = user.friends;
        console.log("friends:" + result)
      }

    })
    return result
  }
  //login
  socket.on("login", async function (user) {
    if (!user.username) { console.log("user.username not found"); return }
    let account = await auth(user.username, user.password)
    let friendList = await checkFriends(user.username)
    if (!account) {
      console.log("Login fail");
      socket.emit("loginStatus", { loginStatus: false })
      return
    }


    else {
      socket.uid = userID
      socket.friendList = friendList
      onlineUsers[userID] = user.username;
      userID++;
      for (let [userID, username] of Object.entries(onlineUsers)) {
        if (usernameList.includes(username)) { continue }
        usernameList.push(username)
        onlineCount++
      }
      socket.emit("loginStatus", { loginStatus: true })
      io.emit("userListUpdate", { usernameList })

      console.log(onlineUsers)
      console.log("Login Success")
      console.log(user.username + '加入了,人數:' + onlineCount + ",成員:" + usernameList.toString());
    }
  })

  socket.on('join', function (user) {
    // 获取请求建立socket连接的url
    // 如: http://localhost:3000/room/room_1, roomID为room_1
    /*var url = socket.request.headers.referer;
    console.log("有人連接" + url)
    var splited = url.split('/');
    var roomID = splited[splited.length - 1];   // 获取房间ID*/
    // 房间用户名单
    let roomID = user.roomID
    //socket.roomID = roomID;
    if (!roomID) { console.log("roomID not found"); return }
    roomInfo[roomID].push(user.username)
    socket.join(roomID);
    io.to(roomID).emit('roomInfo', { userList: roomInfo[roomID] });
    io.to(roomID).emit('broadcast', { username: "admin", user: { username: user.username }, join: true });
    io.emit('roomListUpdate', { roomInfo, roomHost });
    console.log(user.username + '加入了房間' + roomID);
    console.log(roomInfo);
    //chat

    socket.on("chat", outputChatMsg)

    /*socket.on('disconnect', function () {
      let userIDIndex = roomInfo[roomID].indexOf(user.username);
      roomInfo[roomID].splice(userIDIndex, 1);
      console.log(roomInfo);
    })*/


  })
  function outputChatMsg(message) {
    if (!(roomInfo[message.roomID].includes((message.username)))) {
      return false;
    }
    io.to(message.roomID).emit("broadcast", message);
    console.log(message.username + "in room " + message.roomID + " says: " + message.text)
  }

  socket.on("createRoom", function (newRoomInfo) {
    let { roomID, username } = newRoomInfo
    roomInfo[roomID] = [];
    roomHost[roomID] = username;
    //io.emit('roomListUpdate', { roomID: roomID, roomHost: username, create: true });
    io.emit('roomListUpdate', { roomInfo, roomHost });
    console.log('created room' + roomID)

  })
  socket.on("requestRoomInfo", function () { socket.emit("roomListUpdate", { roomInfo, roomHost }) })
  socket.on("requestUserListInfo", function () { socket.emit("userListUpdate", { friendList: socket.friendList, usernameList }) })


  //leave room
  socket.on("leave", (user) => {
    let roomID = user.roomID
    if (!roomID) { console.log("roomID not found"); return }

    socket.removeListener("chat", outputChatMsg)



    let userIDIndex = roomInfo[roomID].indexOf(user.username);
    roomInfo[roomID].splice(userIDIndex, 1);

    if (roomHost[roomID] === user.username) {
      io.to(roomID).emit('roomInfo', { userList: roomInfo[roomID] });
      io.to(roomID).emit('broadcast', { username: "admin", user: { username: user.username }, join: false });
      //change host
      if (roomInfo[roomID].length > 0) {
        roomHost[roomID] = roomInfo[roomID][0]

      }
      //delete room if no one
      else { delete roomInfo[roomID] }

    }
    socket.leave(roomID);
    io.emit('roomListUpdate', { roomInfo, roomHost });



    console.log(user.username + '離開了房間' + roomID);

    console.log(roomInfo);
  })






  //disconnect notice
  socket.on('disconnect', function () {
    if (onlineUsers.hasOwnProperty(socket.uid)) {
      let user = { userID: socket.uid, username: onlineUsers[socket.uid] };

      // 删掉这个用户，在线人数-1
      delete onlineUsers[socket.uid];
      let roomID = socket.roomID
      onlineCount--
      if (roomInfo[roomID]) { roomInfo[roomID].splice(usernameList.indexOf(user.username), 1); }
      usernameList.splice(usernameList.indexOf(user.username), 1);
      //io.to(roomID).emit('roomInfo', { userList: roomInfo[roomID] });
      // 向客户端发送登出事件，同时发送在线用户、在线人数以及登出用户
      io.emit('broadcast', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: user, username: "admin", join: false });
      io.emit("userListUpdate", { usernameList })

      console.log(user.username + '退出了,人數:' + onlineCount + ",成員:" + (usernameList.toString() || "沒人"));
      console.log(roomInfo)
    }

  });
});





http.listen(port, function () {
  console.log('listening on ' + port);
});




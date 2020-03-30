import React from 'react';
import { render } from "react-dom";
import './CreateRoom.css';
import freeze from '../Common/freeze'

function CreateRoom(setRoomID, props, socket, username) {
    freeze()
    let temp = document.createElement("div");
    let location = document.getElementById("lobbyPage").appendChild(temp);
    let removeWindow = () => location.parentNode.removeChild(location);

    let createWindow =
        <div className="CreatRoom">
            <div className="close btn" onClick={closeWindow}>close</div>
            <form onSubmit={createRoom}>
                Please enter room name
            <input id="createRoomID"></input>
                <input type="submit" value="Submit"></input>
            </form>
        </div>

    function createRoom(e) {
        e.preventDefault()
        let roomID = document.getElementById("createRoomID").value;
        socket.emit("createRoom", { roomID: roomID, username: username })
        setRoomID(roomID);
        closeWindow()
        props.history.push('/room')

    }

    function closeWindow() {
        removeWindow()
        freeze(false)
    }
    render(createWindow, location);
}

export default CreateRoom
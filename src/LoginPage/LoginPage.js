import React, { useEffect } from 'react';
import './LoginPage.css'
import freeze from '../Common/freeze'
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect,
    Link
} from "react-router-dom";
function LoginPage({ socket, setAccountInfo, setChatRecord, ...props }) {
    useEffect(() => {
        socket.emit('disconnect')
        socket.removeAllListeners()
        setAccountInfo(null)
    }, []
    )


    function login(visitor = false) {
        socket.removeAllListeners()
        let username, password
        if (visitor) {
            username = "遊客";
            password = "遊客"
        } else {
            username = document.getElementById("inputName").value;
            password = document.getElementById("inputPassword").value
        }

        socket.emit("login", {
            username: username,
            password: password
        })
        socket.on("loginStatus", function (status) {
            if (status.loginStatus) {
                setAccountInfo(status.accountInfo)
                setChatRecord(status.chatRecord)
                console.log(status.chatRecord)
                freeze(false);
                return props.history.push('/')
            }
            else {
                document.getElementById("authWrong").innerHTML = "Login Fail"
                document.getElementById("authWrong").classList.remove("wrongAuth")
                void (document.getElementById("authWrong").offsetHeight)
                document.getElementById("authWrong").classList.add("wrongAuth")
            }
        })




    }

    freeze()
    return (
        <div className="loginPage">
            Please Login
            <br></br>
            <label>Username: </label>
            <input id="inputName"></input>
            <label>Password: </label>
            <input id="inputPassword"></input>
            <button onClick={() => login(false)}>Login</button>
            <button onClick={() => login(true)}>visitor</button>
            <Link to="/createaccount" >CreateAccount</Link>
            <div className="wrongAuth" id="authWrong"></div>

        </div>
    )

}
export default LoginPage;
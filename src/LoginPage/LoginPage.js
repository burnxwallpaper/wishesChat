import React, { useEffect } from 'react';
import './LoginPage.css'
import freeze from '../Common/freeze'
/*import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect,
    Link
} from "react-router-dom";*/
function LoginPage({ username, socket, setUsername, ...props }) {
    useEffect(() => {
        socket.emit('disconnect')
        socket.removeAllListeners()
        setUsername(null)
    }, []
    )


    function login() {
        socket.removeAllListeners()
        socket.emit("login", {
            username: document.getElementById("inputName").value,
            password: document.getElementById("inputPassword").value
        })
        socket.on("loginStatus", function (status) {
            if (status.loginStatus) {
                setUsername(document.getElementById("inputName").value)
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
            <button onClick={() => login()}>Login</button>
            <div className="wrongAuth" id="authWrong"></div>

        </div>
    )

}
export default LoginPage;
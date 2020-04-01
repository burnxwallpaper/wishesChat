import React, { useEffect } from 'react';
import './LoginPage.css'
import { Link } from "react-router-dom";
import Spinner from '../Common/Spinner'
function LoginPage({ socket, setAccountInfo, accountInfo, setChatRecord, setAllUsersIcon, setFdListWithIcon, ...props }) {
    useEffect(() => {
        if (accountInfo) {
            window.location.reload()
        }
        setAccountInfo(null)
    }, [])

    function login(visitor = false) {
        //socket.removeAllListeners()
        Spinner()
        let username, password
        /*if (visitor) {
            username = "visitor";
            password = "visitor"
        } else {*/
        username = document.getElementById("inputName").value;
        password = document.getElementById("inputPassword").value
        //}

        socket.emit("login", {
            username: username,
            password: password
        })
        socket.on("loginStatus", function (status) {
            setTimeout(() => {
                Spinner(false)
                if (status.loginStatus) {
                    setAllUsersIcon(status.allUsersIcon)
                    setAccountInfo(status.accountInfo)
                    setChatRecord(status.chatRecord)
                    setFdListWithIcon(status.fdListWithIcon)
                    return props.history.push('/')
                }
                else {
                    document.getElementById("authWrong").innerHTML = "Login Fail"
                    document.getElementById("authWrong").classList.remove("wrongAuth")
                    void (document.getElementById("authWrong").offsetHeight)
                    document.getElementById("authWrong").classList.add("wrongAuth")
                }
            }, 300)


        })
    }
    //<Link to="/createaccount" >CreateAccount</Link>
    return (
        <div className="loginPage">
            <span id="loginLabel">Login</span>
            <span className="tooltipac" title="username from `aaa` to `ddd`, pw is the same ;  ( e.g. username = `bbb`; pw=`bbb`)" >Test account info</span>
            <div className="form-field">
                <label htmlFor="inputName">Username: </label>
                <input id="inputName" type="text" name="username" className="form-field" required></input>
            </div>
            <div className="form-field">
                <label htmlFor="inputPassword">Password: </label>
                <input id="inputPassword" type="password" name="password" className="form-field" required></input>
            </div>

            <button className="loginBtn" onClick={() => login(false)}>Login</button>
            <div className="wrongAuth" id="authWrong"></div>
            <Link to="/createaccount" className="createAccount">Create Account</Link>

        </div>
    )

}
export default LoginPage;
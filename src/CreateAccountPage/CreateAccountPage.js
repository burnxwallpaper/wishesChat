import React, { useEffect } from 'react';
import SuccessNotify from '../Common/SuccessNotify'
import Spinner from '../Common/Spinner'
import { Link } from "react-router-dom";
function CreateAccountPage({ socket, ...props }) {
    useEffect(() => {
        socket.emit('disconnect')
        socket.removeAllListeners()
    }, []
    )

    function createAccount(e) {
        e.preventDefault()
        Spinner()
        socket.removeAllListeners()
        let username = document.getElementById("inputName").value;
        let password = document.getElementById("inputPassword").value

        socket.emit("createAccount", {
            username: username,
            password: password
        })
        socket.on("createAccount", function (res) {

            if (res.success) {
                setTimeout(() => {
                    SuccessNotify("Create account successfully,you may now login.")
                    Spinner(false)
                    props.history.push('/login')
                }, 300)
            }
            else {
                setTimeout(() => {
                    SuccessNotify("Username has been used", "red")
                    Spinner(false)
                }, 300)
            }

        })
    }
    return (
        <div >
            <form className="loginPage" onSubmit={createAccount}>
                <span id="loginLabel">New Account</span>
                <br></br>
                <div className="form-field">
                    <label htmlFor="inputName">Username: </label>
                    <input id="inputName" type="text" name="username" className="form-field" required></input>
                </div>
                <div className="form-field">
                    <label htmlFor="inputPassword">Password: </label>
                    <input id="inputPassword" type="password" name="password" className="form-field" required></input>
                </div>
                <input className="loginBtn" type="submit" value="Create"></input>
                <Link to="/login" className="createAccount">Login</Link>
            </form>


        </div>
    )
}
export default CreateAccountPage;
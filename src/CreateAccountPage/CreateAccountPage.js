import React from 'react';
import SuccessNotify from '../Common/SuccessNotify'
import Spinner from '../Common/Spinner'
import { Link } from "react-router-dom";
function CreateAccountPage({ socket, ...props }) {

    function createAccount(e) {
        e.preventDefault()
        Spinner()
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
                    SuccessNotify(res.msg, "red")
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
                    <label htmlFor="inputName" >Username: </label>
                    <input id="inputName" type="text" pattern="^[A-Za-z0-9]{3,9}$"
                        name="username" className="form-field" minLength="3" maxLength="9" required></input>
                </div>
                <div className="form-field">
                    <label htmlFor="inputPassword">Password: </label>
                    <input id="inputPassword" type="password" name="password" className="form-field" minLength="3" maxLength="9" required></input>
                </div>
                <input className="loginBtn" type="submit" value="Create"></input>
                <Link to="/login" className="createAccount">Login</Link>
            </form>


        </div>
    )
}
export default CreateAccountPage;
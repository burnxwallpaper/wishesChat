import React, { useEffect } from 'react';
function CreateAccountPage({ socket, ...props }) {
    useEffect(() => {
        socket.emit('disconnect')
        socket.removeAllListeners()
    }, []
    )

    function createAccount(visitor = false) {
        socket.removeAllListeners()
        let username = document.getElementById("inputName").value;
        let password = document.getElementById("inputPassword").value

        socket.emit("createAccount", {
            username: username,
            password: password
        })
        socket.on("createAccountSuccess", function () {
            console.log("createAccountSuccess")
        })
    }
    return (
        <div className="loginPage">
            Please fillin Info
            <br></br>
            <label>Username: </label>
            <input id="inputName"></input>
            <label>Password: </label>
            <input id="inputPassword"></input>
            <button onClick={() => createAccount()}>Create</button>
        </div>
    )

}
export default CreateAccountPage;
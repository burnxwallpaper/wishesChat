import './Popup.css';
import React from "react";
import { render } from "react-dom";
import freeze from './freeze'
function Popup() {
    let temp = document.createElement("div");
    let location = document.body.appendChild(temp);
    freeze()
    render(
        <div className="Popup">
            <div>You are disconnected, please login again</div>
            <button onClick={() => window.location.reload()}>Login</button>
        </div>, location);

}
export default Popup;
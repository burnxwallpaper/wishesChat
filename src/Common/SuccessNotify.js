import React from "react";
import { render } from "react-dom";
import './SuccessNotify.css'
function SuccessNotify(words = "Added Successfully!", color = "green") {
    const basic = "SuccessNotify"
    let temp = document.createElement("div");
    let location = document.body.appendChild(temp);
    render(<div className={[basic, color].join(' ')}>{words}</div>, location);
    let removeNotify = () => location.parentNode.removeChild(location);
    setTimeout(removeNotify, 3000)
    /*return (
        <>

            
        </>
    );*/
}

export default SuccessNotify;
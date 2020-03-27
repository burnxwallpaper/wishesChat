import React from 'react';
import './InputBox.css';
function InputBox({ handleSubmit }) {

    return (
        <form className="InputBox" onSubmit={handleSubmit}>

            <input id="inputMessage" ></input>
            <label htmlFor="InputBoxSubmit" className="InputBoxSubmitLabel" ><i className="fas fa-arrow-alt-circle-right"></i></label>
            <input id="InputBoxSubmit" className="InputBoxSubmit" type="submit" value="Submit"></input>

        </form>
    )

}
export default InputBox;
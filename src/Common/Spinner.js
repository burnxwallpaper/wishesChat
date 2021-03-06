import './spinner.css';
import freeze from '../Common/freeze'
function Spinner(spinShow = true) {

    if (spinShow) {
        freeze(true, true)
        var div = document.createElement("div");
        if (document.getElementById("spinner1")) {
            return
        }
        div.id = "spinner1"
        div.className += "spinner1";
        document.body.appendChild(div);
    }

    else {
        let spinner = document.getElementById("spinner1")
        if (!spinner) return
        freeze(false);
        spinner.parentNode.removeChild(spinner);
    }

}

export default Spinner;
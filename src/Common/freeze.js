
import './freeze.css';
function freeze(freeze = true) {

    var div = document.createElement("div");
    if (freeze) {
        if (document.getElementById("freezelayer")) {
            document.getElementById("freezelayer").classList += "overlay";
            return
        }
        div.id = "freezelayer"
        div.className += "overlay";
        document.body.appendChild(div);
    }


    if (!freeze) document.getElementById("freezelayer").classList.remove("overlay")
}

export default freeze;
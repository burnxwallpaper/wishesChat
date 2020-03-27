
import './freeze.css';
function freeze(freeze = true, superfreeze = false) {

    var div = document.createElement("div");
    if (freeze) {
        if (document.getElementById("freezelayer")) return
        div.id = "freezelayer"

        superfreeze ?
            div.className = "superOverlay"
            : div.className = "overlay"
        document.body.appendChild(div);
    }

    else {
        let freezelayer = document.getElementById("freezelayer")
        freezelayer.parentNode.removeChild(freezelayer)
    }
}

export default freeze;
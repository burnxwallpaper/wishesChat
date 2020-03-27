
import './freezeBlack.css';
function freezeBlack(freeze = true) {

    var div = document.createElement("div");
    if (freeze) {
        if (document.getElementById("freezelayerBlack")) {
            document.getElementById("freezelayerBlack").classList += "overlayBlack";
            return
        }
        div.id = "freezelayerBlack"
        div.className += "overlayBlack";
        document.body.appendChild(div);
    }


    if (!freeze) document.getElementById("freezelayerBlack").classList.remove("overlayBlack")
}

export default freezeBlack;
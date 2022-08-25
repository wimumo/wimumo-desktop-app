// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.api.receive("asynchronous-reply", (data) => {
    console.log('Received ${data} from main process');
});

function check() {
    console.log("enviando");
    window.api.send('asynchronous-message', 'programar_osc')
}

var backup = "";


function cambiarNav(id) {
    
    
    var elemento = id.substring(3);
    
    elementos = ["Instrucciones", "Configuracion", "VerSenales", "Musica","Rerouter"];

    for (var i = 0; i < elementos.length; i++) {
        if (elementos[i] == elemento) {
            document.getElementById("but" + elemento).style = "background:var(--c1)";
            document.getElementById(elemento).style.display = "block";
            console.log(backup);

        }
        else {
            document.getElementById("but" + elementos[i]).style = "background: SlateGray";
            backup = document.getElementById(elementos[i]).style.display;

            document.getElementById(elementos[i]).style.display = "none";
        }
    }

}

cambiarNav("butInstrucciones");

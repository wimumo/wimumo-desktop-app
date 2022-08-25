
// Usando https://www.arc.id.au/CanvasLayers.html

var n_file = 0;
var grabando = false;
var dinFsps = 100; // Fps supuesto al comienzo, luego se actualiza solo
var dinFspsArr = [100, 100, 100, 100, 100];  // arreglo para promedio de Fps dinámico
var samplesEnv = []; // Buffer para almacenar las muestras que deben graficarse

var sampCount = 100;
var tGrafms = 50; // Período de graficación en milisegundos
var Fsps = 100;
var sampPergraf = Math.ceil(Fsps / (1000 / tGrafms));

var alto = 200;
var ancho = 400;
var escala = 32;
var offset = Math.floor(alto / 2);

var e1 = 0;
var t_tick = tGrafms / 1000;
var t_ancho = 5;
var dx = t_tick / t_ancho * ancho;
var x = 0;
var x_ant = 0;
var e1_ant = 0;


function toggleGrabacion() {
    if (grabando == false) {
        grabando = true;
        content = [];
        document.getElementById("rec").style.backgroundColor = "red";
        document.getElementById("rec").innerText = "Grabando";
    }
    else if (grabando == true) {
        grabando = false;
        document.getElementById("rec").style.backgroundColor = "darkred";
        document.getElementById("rec").innerText = "Grabar";
    }
}


//
// Se recibe el arreglo para graficar. 
//
function graficar(muestras) {

    // Para calculo de Fps dinámico 
    sampCount += muestras.length;

    if (samplesEnv.length > 10 * dinFsps) {
        samplesEnv = [];
        console.log("Sobrellenado de buffer");
    }

    samplesEnv.push(...muestras); // el operador ... convierte un arreglo en una lista de parámetros
    //console.log(samplesEnv);
    if (grabando == true) {
        content.push(...muestras);
    }


}

setInterval(printDinFsps, 1000);
function printDinFsps() {

    // console.log("SPS: " + sampCount);
    dinFspsArr.push(sampCount);
    dinFspsArr.shift();
    let Nd = dinFspsArr.length;
    dinFsps = dinFspsArr[0];
    for (let di = 1; di < Nd; di++) {
        dinFsps += dinFspsArr[di];
    }
    dinFsps /= Nd;
    sampCount = 0;
}


setInterval(graficarSigs, tGrafms);


var c1;
var textlabel;
var ctx1;
var cursor1;
function cargarCanvas(c, l) {
    c1 = c;
    ancho = c1.width;
    ctx1 = c1.getContext("2d");
    ctx1.clearRect(0, 0, ancho, alto);
    ctx1.fillStyle = "red";
    cursor1 = new Cursor(c1, "red");
    textlabel = l;
    c1.addEventListener("mousedown", function (e) {
        getMousePosition(c1, e);
    });
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x,
        "Coordinate y: " + y);

    cursor1.pedirMovimiento(y);
    textlabel.innerHTML = "y: "+ String((y-offset)*escala*-1);
}

function buttonScaleDown() {
    escala = escala * 2;
}

function buttonScaleUp() {
    escala = escala / 2;
}

/*
*   Funcion graficarSigs
*   Grafica lo que encuentra en el arreglo samplesEnv
*   ajustandose segun dinFsps, t_tick, dx, ancho
*   almacena memoria en x_ant y e1_ant
*/
var estiloLinea = 'darkOrchid';
function graficarSigs() {

    var Ne = samplesEnv.length;
    //console.log(Ne); //<- Un muy buen debug del estado de los buffers

    if (Ne == 0) {      // Nada para fraficar
        return;
    }

    spg = Ne; //Math.ceil(dinFsps * t_tick); // Cuantas muestras debo graficar en cada ventana m/s * s = m

    let dx_pix = dx / spg;  // Si tengo que graficar limn puntos en dx pixeles, cuanto avanza c/u
    ctx1.beginPath();
    ctx1.strokeStyle = estiloLinea;
    ctx1.moveTo(x_ant, e1_ant);
    for (let j = 0; j < spg; j++) {
        e1 = samplesEnv.shift();
        e1 = (-e1 * 1.0 / escala + offset);
        x = x + dx_pix;

        ctx1.lineTo((x), e1);
        //ctx1.fillRect(Math.floor(x), e1, 1, 1);

        if (x > ancho) {
            ctx1.stroke();
            ctx1.clearRect(0, 0, ancho, alto);
            cursor1.refrescar();
            ctx1.beginPath();
            ctx1.strokeStyle = estiloLinea;
            x = 0;
            x_ant = 0;
            ctx1.moveTo(0, e1_ant);
        }
    }
    x_ant = x;
    e1_ant = e1;
    ctx1.stroke();
    cursor1.updatePosition();
}

class Cursor {
    constructor(canv, col) {
        this.ctx = canv.getContext("2d");;
        this.ancho = canv.width;
        this.pos = 0;
        this.color = col;
        this.nuevaPos = 0;

    }

    refrescar() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.moveTo(0, this.pos);
        this.ctx.lineTo(this.ancho, this.pos);
        this.ctx.stroke();
    }

    borrar() {
        ctx1.fillStyle = this.color;
        ctx1.fillRect(0, this.pos-1, this.ancho, 2);
    }

    updatePosition() {
        if (this.nuevaPos != this.pos) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = "destination-out";
            this.borrar();
            this.ctx.restore();
            this.pos = this.nuevaPos;
            this.refrescar();
        }
    }

    pedirMovimiento(nueva_pos) {
        this.nuevaPos = nueva_pos;
    }
}

function buttonDescargar() {
    filename = "datos" + n_file + ".txt";
    n_file++;
    var blob = new Blob([JSON.stringify(content)], {
        type: "text/plain;charset=utf-8"
    });

    saveAs(blob, filename);
}
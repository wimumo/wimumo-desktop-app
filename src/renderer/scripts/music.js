// 
// SOCKETS Y MUESTRAS
//

var canal = 1;


//
// VÚMETROS Y SLIDERS
//

var sch1 = document.getElementById("sch1");
var sch2 = document.getElementById("sch2");

var sr1 = 1024; var g1 = 100 / sr1;
var sr2 = 1024; var g2 = 100 / sr2;
var sr3 = 1024; var g3 = 100 / sr3;

sch1.oninput = function () {
    sr1 = 1001 - this.value;
    if (sr1 >= 1000) {
        g1 = 0;
    }
    else {
        g1 = 100 / sr1;
    }
    actualizarValor(1, lastamp1);
    console.log(sr1);
}
sch2.oninput = function () {
    sr2 = 1001 - this.value;
    if (sr2 >= 1000) {
        g2 = 0;
    }
    else {
        g2 = 100 / sr2;
    }
    actualizarValor(2, lastamp2);

}


var amp1 = 1, amp2 = 1;
var lastamp1 = 1, lastamp2 = 1;

function actualizarValor(canal, valor) {

    if (valor == undefined) return;

    if (canal == 1) {
        amp1 = (valor < sr1 ? valor : sr1) * g1;
        document.getElementById("ch1").style.backgroundColor = 'rgb(' + parseInt(amp1 * 2.55) + ',0,0)';
        if (audioEnabled == true) {
            lastamp1 = amp1;
            cambiarVolumenes(1, amp1);
        }
    }
    if (canal == 2) {
        amp2 = (valor < sr2 ? valor : sr2) * g2;
        document.getElementById("ch2").style.backgroundColor = 'rgb(' + parseInt(amp2 * 2.55) + ',0,0)';
        if (audioEnabled == true) {
            cambiarVolumenes(2, amp2);
        }
    }


}

//
//  AUDIO 
//

var audioEnabled = false;

var volumeMaster;
var volume1;
var volume2;
var volume3;

function cambiarVolumenes(canal, valor) {
    switch (canal) {
        case 1: volume1.gain.value = valor * 0.3 / 100.0; break;
        case 2: volume2.gain.value = valor * 0.3 / 100.0; break;
    }

}



function habilitarAudio() {

    if (audioEnabled == false) {
        audioEnabled = true;
        content = [];
        document.getElementById("audioEN").style.backgroundColor = "red";
        document.getElementById("audioEN").innerText = "Audio ON";
    }
    else if (audioEnabled == true) {
        audioEnabled = false;
        volumeMaster.disconnect();
        document.getElementById("audioEN").style.backgroundColor = "darkred";
        document.getElementById("audioEN").innerText = "Audio OFF";
        return;
    }

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)

    var filter = audioCtx.createBiquadFilter();
    filter.frequency.value = 1000;

    volumeMaster = audioCtx.createGain();
    volumeMaster.connect(audioCtx.destination);

    filter.connect(volumeMaster);

    // we create the gain module, named as volume, and connect it to our
    volume1 = audioCtx.createGain();
    volume1.connect(filter);

    volume2 = audioCtx.createGain();
    volume2.connect(filter);

    //these sines are the same, exept for the last connect statement.
    //Now they are connected to the volume gain module and not to the au

    var sinea = audioCtx.createOscillator();
    sinea.frequency.value = 392;
    sinea.type = "sine";
    sinea.start();
    sinea.connect(volume1);

    var sineb = audioCtx.createOscillator();
    sineb.frequency.value = 466;
    sineb.type = "sine";
    sineb.start();
    sineb.connect(volume2);



    volumeMaster.gain.value = 0.5;
    volume1.gain.value = 0.3;
    volume2.gain.value = 0.3;


    audioEnabled = true;

    setInterval(reportarValores, 1000);
}

function reportarValores() {
    console.log("sr1: " + sr1);
    console.log("amp1: " + amp1);
    console.log("vol1: " + volume1.gain.value);
}

//
//  FIN AUDIO
//

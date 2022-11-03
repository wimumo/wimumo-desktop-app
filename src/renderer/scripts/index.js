/* Manu principal */

function menu_open() {
    document.getElementById('menu').setAttribute('shown','');
    document.getElementById("overlay").setAttribute('shown','');
  }
  
function menu_close() {
    document.getElementById('menu').removeAttribute('shown');
    document.getElementById('overlay').removeAttribute('shown');
}

/* Pestañas */

categories = ['instrucciones', 'configuracion', 'graficador', 'musica', 'rerouter'];
category_active = categories[0];

function body_exchange (category_selected) {

  document.getElementById(category_active).setAttribute('hiden','');
  document.getElementById(category_selected).removeAttribute('hiden');

  category_active = category_selected;

  menu_close();
}

/* Datos */

class Movprom {
  constructor(n) {
    this.arr = [];
    this.N = n;
  }

  nuevoDato(dat) {
    this.arr.push(dat);
    if (this.arr.length > this.N) {
      this.arr.shift();
    }
    
    var acc = 0.0;
    for (var i = 0; i < this.arr.length; i++) {
      acc += parseFloat(this.arr[i]);
    }
    acc /= this.arr.length;
    return acc;
  }
}


var info_received = false;
var info_reported = false;
var base_route = "/wimumo020";
var channels = [];
var channels_active = [];
var numch = 0;
var filt_batt = new Movprom(15);

window.api.receive('osc', (data) => {

  if (data == 'undefined') return;

  if (info_received == false && data[0].substring(11, 15) == "info") {
    info_received = true;
    base_route = data[0].substring(0, 10);
    for (let i = 0; i < parseInt(data[6]); i++) {
      channels.push(data[7 + i].substring(10));
    }
    enableChannels(channels);
  }

  /* Graficador */
  if(info_received == true && category_active == categories[2]) {
    /* Acá se hace el filtado para graficar */
    for (let i = 0; i < channels_active.length; i++){
      if (data[0] == (base_route + channels_active[i].channel)) {
        var sample = [];
        for (let i = 1; i < data.length; i++) {
          sample.push(parseInt(data[i]));
        }
        plot(channels_active[i].channel, sample);
      }
    } 
  }
  /* Musica */
  else if (info_received == true && category_active == categories[3]) {
    if (data[0] == base_route + "/env/ch1" && audioEnabled == true) {
      actualizarValor(1, parseInt(data[1]));
    }
    if (data[0] == base_route + "/env/ch2" && audioEnabled == true) {
      actualizarValor(2, parseInt(data[1]));
    }
  }
  /* Configuración */
  else if (info_received == true && category_active == categories[1]) {
  
    if (info_reported == false && data[0] == base_route + "/info") {
      info_reported = true;
      var cad = "";
      cad += "WIMUMO " + data[0].substring(7, 10) + " " + "<mark>detectado</mark>! <br> en IP ";
      cad += data[1];
      if (data[2] == "false") {
        cad += '<br> NO está enviando datos (configure manualmente o presione "autoconfigurar")';
      }
      else {
        cad += '<br> Enviando datos a: ';
        cad += data[3] + ":" + data[4];
      }
      cad += '<br> Nivel de batería aproximado: <span id="nivel_batt"></span>';
      document.getElementById("estado").innerHTML = cad;
    }
    if (info_reported == true && data[0] == base_route + "/info" && typeof filt_batt !== 'undefined') {
      var nivel_batt = data[5];
      nivel_batt = filt_batt.nuevoDato(nivel_batt);
      if(nivel_batt<0) nivel_batt = 0;
      if(nivel_batt>100) nivel_batt = 100;
      var nivel_batt_pc = "";
      nivel_batt_pc += parseInt(nivel_batt) + "%";
      document.getElementById("nivel_batt").innerHTML = nivel_batt_pc;
    }
  }

});


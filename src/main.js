// Modules to control application life and create native browser window
//<link rel="stylesheet" href="mvp.css">
//<script src="zero-md.min.js"></script>
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
var osc = require('node-osc');
const {
  networkInterfaces
} = require('os');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Requerido para el envío de websockets
var count = 0;
var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;
var WebSocketFrame = require('websocket').frame;
var WebSocketRouter = require('websocket').router;
var W3CWebSocket = require('websocket').w3cwebsocket;
var http = require('http');

var dest = "dest-construct";

let mainWindow;
var oscServer;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  //mainWindow.setAutoHideMenuBar(true);
  //mainWindow.setMenu(null);
  //mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')
  console.log("index cargado");
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  console.log(__dirname);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  oscServer = new osc.Server(4560, '0.0.0.0', () => {
    console.log('OSC Server is listening');

    // Recibe bundles y envía los mensajes 
  });

  oscServer.on('bundle', function (bundle) {

    //console.log(bundle);
    bundle.elements.forEach((element, i) => {
      mainWindow.webContents.send('osc', element);

      /*
      Envío de WEBSOCKETS
      */

      if (element[0].substring(10, 18) == "/env/ch1" && element.length == 2) {
        var s = "1," + element[1];
        //console.log(s);
        if (wsServer != null && wsServer.connections.length > 0) {
          //console.log(wsServer.connections)
          wsServer.connections[0].sendUTF(s)
          //wsServer.connections[0].sendUTF(" "+count)
          count++
          console.log(s);

        }
      }

      if (element[0].substring(10, 18) == "/env/ch2" && element.length == 2) {
        var s = "2," + element[1];
        //console.log(s);
        if (wsServer != null && wsServer.connections.length > 0) {
          //console.log(wsServer.connections)
          wsServer.connections[0].sendUTF(s)
          //wsServer.connections[0].sendUTF(" "+count)
          count++
          //console.log(s);
        }
      }
    });


  });


  // También recibe mensajes y los reenvía
  oscServer.on('message', function (msg) {
    //console.log(msg);
    mainWindow.webContents.send('osc', msg);
    //console.log('llegó msg');
    if (wsServer != null && wsServer.connections.length > 0) {
      //console.log(wsServer.connections)
      //wsServer.connections[0].sendUTF(msg)
    }
  });



  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    oscServer.close();
    if (process.platform !== 'darwin') app.quit()
  })



  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  // Event handler for asynchronous incoming messages
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg);
    // Event emitter for sending asynchronous messages


    //mainWindow.webContents.send('asynchronous-reply', 'async pong')

    if (arg == "pedido_iplocal") {
      /* 
    Notificación de IP local a página
     */

      const nets = networkInterfaces();
      const results = [];

      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
            results.push(net.address);
          }
        }
      }
      console.log(results);
      mainWindow.webContents.send('iplocal', results);
    }

    else if (arg == "dest-construct") {
      dest = arg;

    }
    else if(arg == "dest-processing-p5js"){
      dest = arg;

    }

  })


});


//
// Manejo de Websockets 
//

var server = http.createServer(function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(80, function () {
  console.log((new Date()) + ' Server is listening on port 80');
});

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}



wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  
  if(dest == "dest-construct"){
  var connection = request.accept('echo-protocol', request.origin);
  }
  else{
    var connection = request.accept(null, request.origin);
  }
  console.log((new Date()) + ' Connection accepted.');
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      //console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
    else if (message.type === 'binary') {
      //console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
// Fin websockets



const { app, BrowserWindow, ipcMain } = require('electron');
const { networkInterfaces } = require('os');
const http = require('http');
const WebSocketServer = require('websocket').server;
const osc = require('node-osc');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

/* Ventana Electron */
var mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // DEBUG
  //mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });


  app.on('window-all-closed', () => {
      oscServer.close();
      if (process.platform !== 'darwin') {
        app.quit();
      }
    }
  );

  ipcMain.on('get-iplocal', (event, arg) => {
    /* Notificación de IP local a página */

    const nets = networkInterfaces();
    const results = [];

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          results.push(net.address);
        }
      }
    }
    mainWindow.webContents.send('iplocal', results);
  });

  /*
  *   OSC 
  */
  var nClients = 0;

  const oscServer = new osc.Server(4560, '0.0.0.0', () => {
    console.log('OSC Server is listening');
  });

  oscServer.on('bundle', function (bundle) {

    bundle.elements.forEach((element, i) => {
      mainWindow.webContents.send('osc', element);

      /* Envío de datos a través de WS */
      if (element[0].substring(10, 18) == "/env/ch1" && element.length == 2) {
        var s = "1," + element[1];
        if (wsServer != null && wsServer.connections.length > 0) {
          wsServer.connections[0].sendUTF(s)
          nClients++
        }
      }
      if (element[0].substring(10, 18) == "/env/ch2" && element.length == 2) {
        var s = "2," + element[1];
        if (wsServer != null && wsServer.connections.length > 0) {
          wsServer.connections[0].sendUTF(s)
          nClients++
        }
      }
    });

  });

  oscServer.on('message', function (msg) {
    mainWindow.webContents.send('osc', msg);
  });

  /*
  *   Websockets 
  */

  var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
  });
  server.listen(80, function () {
    console.log((new Date()) + ' Server is listening on port 80');
  });

  const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  function originIsAllowed(origin) {
    return true;
  }

  wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    let connection = request.accept(request.requestedProtocols[0], request.origin);
    
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

});




const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const express = require('express');
const Store = require('electron-store');
const store = new Store();
const request = require('request')
const bodyParser = require('body-parser');
const logger = require('./logger');
const Tray = electron.Tray
const iconPath = path.join(__dirname, 'icon.png')
const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow;
const app2 = express()

app2.set('views', path.join(__dirname, 'views'));
app2.use(express.static('public'));

app2.set('view engine', 'ejs');
let tray = null
app.on('ready', function () {
  express()
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    },
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
    backgroundColor: '#383c4a'
  });
  mainWindow.loadURL('http://localhost:5000/');
  mainWindow.focus();
  tray = new Tray(iconPath)
  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();
});
var contextMenu = Menu.buildFromTemplate([
  { label: 'Show App', click:  function(){
      mainWindow.show();
  } },
  { label: 'Quit', click:  function(){
      app.isQuiting = true;
      app.quit();
  } }
]);
tray.setContextMenu(contextMenu)
  mainWindow.on('closed', function () {
    app.quit();
  });
})

process.on("uncaughtException", (err) => {
    console.log(err);
});

app2.get('/', (req, res, next) => {
  res.render('mainWindow', { bacc: 'file://' + __dirname + '/background.jpg', setup: 'file://' + __dirname + '/static/setupWindow.html' });
});

app2.listen(5000, function () {
  logger.log('Express running!');
});

app2.use(express.urlencoded({ extended: false }))

app2.post('/setup', function (req, res) {
  request('https://ratings.tankionline.com/api/eu/profile/?user=' + req.body.name, { json: true }, (errr, ress, body) => {
    try {
      if (ress.body.responseType == "OK") {
        store.set('name', req.body.name);
        store.set('size', req.body.size);
        store.set('logo', req.body.logo)
        res.send("SAVED! You can now close this window!");
      } else {
        res.send("User Not Found");
      }
    } catch (e) {
      res.send("User Not Found");
    }
  })
});

app2.get('/rpc', (req, res, next) => {
try {
 if ((store.get('size')) == "small") {
  const rpcc = require('./rpc')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'static/running.html'),
    nodeIntegration: false,
    protocol: 'file:',
    slashes: true
  }))
} else if ((store.get('size')) == "big") {
  const rpcc = require('./rpc')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'static/running.html'),
    nodeIntegration: false,
    protocol: 'file:',
    slashes: true
  }))
} else {
mainWindoww = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    },
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
    backgroundColor: '#383c4a'
  });
  mainWindoww.loadURL(url.format({
    pathname: path.join(__dirname, 'static/setupWindow.html'),
    nodeIntegration: false,
    protocol: 'file:',
    slashes: true
  }))
}
} catch (e) {
mainWindoww = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    },
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
    backgroundColor: '#383c4a'
  });
  mainWindoww.loadURL(url.format({
    pathname: path.join(__dirname, 'static/setupWindow.html'),
    nodeIntegration: false,
    protocol: 'file:',
    slashes: true
  }))
}
})

if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

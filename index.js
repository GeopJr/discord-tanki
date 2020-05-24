const electron = require('electron');
const { autoUpdater } = require("electron-updater")
const url = require('url');
const path = require('path');
const express = require('express');
const Store = require('electron-store');
const store = new Store();
const logger = require('./logger');
const Tray = electron.Tray
const iconPath = path.join(__dirname, 'icon.png')
const { app, BrowserWindow, Menu, protocol, ipcMain } = require('electron');
const expressApp = express()
const tankionline = require("tankionline.js");

expressApp.set('views', path.join(__dirname, 'views'));
expressApp.use(express.static('public'));
expressApp.set('view engine', 'ejs');

let mainWindow;
let tray = null
let win;

function sendStatusToWindow(text) {
  logger.log(text);
  win.webContents.send('message', text);
}
function createAboutWindow() {
  win = new BrowserWindow({ width: 530, height: 156, backgroundColor: '#383c4a', autoHideMenuBar: true, useContentSize: true, webPreferences: { webSecurity: false, nodeIntegration: true }, });
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
  win.close();
})
autoUpdater.on('error', (err) => {
  logger.log(err)
  sendStatusToWindow('Error in auto-updater. ' + err);
  win.close();
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Downloading: " + progressObj.transferred + "/" + progressObj.total + " | " + progressObj.percent + "% " + "(" + progressObj.bytesPerSecond + "/s)"
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

app.on('ready', function () {
  express()
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    },
    autoHideMenuBar: true,
    useContentSize: true,
    resizable: true,
    backgroundColor: '#383c4a',
  });
  mainWindow.loadURL('http://localhost:5000/');
  mainWindow.focus();
  tray = new Tray(iconPath)
  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'About', click: function () {
        createAboutWindow();
      }
    },
    {
      label: 'Quit', click: function () {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu)
  createAboutWindow()
  autoUpdater.checkForUpdatesAndNotify();
  mainWindow.on('closed', function () {
    app.quit();
  });
})

process.on("uncaughtException", (err) => {
  logger.log(err);
});

expressApp.get('/', (req, res, next) => {
  res.render('mainWindow', { materialIcons: 'file://' + __dirname + "./node_modules/material-design-icons/iconfont/material-icons.css", css: 'file://' + __dirname + '/public/css/materialize.min.css', js: 'file://' + __dirname + '/public/js/materialize.min.js', version: require('./package.json').version, setup: 'file://' + __dirname + '/static/setupWindow.html' });
});

expressApp.listen(5000, function () {
  logger.log('Express running!');
});

expressApp.use(express.urlencoded({ extended: false }))

expressApp.post('/setup', async function (req, res) {
  let ratings = new tankionline.ratings(req.body.name, 'en');
  try {
    await ratings.stats()
    store.set('name', req.body.name);
    store.set('size', req.body.size);
    store.set('logo', req.body.logo)
    res.send("SAVED! You can now close this window!");
  } catch{
    res.send("User Not Found");
  }
});

expressApp.get('/rpc', (req, res, next) => {
  try {

    if (store.get('size') == "small" || store.get('size') == "big") {
      require('./rpc')
      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'static/running.html'),
        nodeIntegration: false,
        protocol: 'file:',
        slashes: true
      }))
    } else {
      newWindow = new BrowserWindow({
        webPreferences: {
          webSecurity: false
        },
        autoHideMenuBar: true,
        useContentSize: true,
        resizable: true,
        backgroundColor: '#383c4a'
      });
      newWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'static/setupWindow.html'),
        nodeIntegration: false,
        protocol: 'file:',
        slashes: true
      }))
    }
  } catch (err) {
    logger.log(err)
    newWindow = new BrowserWindow({
      webPreferences: {
        webSecurity: false
      },
      autoHideMenuBar: true,
      useContentSize: true,
      resizable: true,
      backgroundColor: '#383c4a'
    });
    newWindow.loadURL(url.format({
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

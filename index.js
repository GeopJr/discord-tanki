const electron = require('electron');
const isDev = require('electron-is-dev');
// const {
//     autoUpdater
// } = require("electron-updater")
const url = require('url');
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const Store = require('electron-store');
const store = new Store();
const logger = require('./logger');
const Tray = electron.Tray
const iconPath = path.join(__dirname, 'icon.png')
const {
    app,
    BrowserWindow,
    Menu,
    protocol,
    ipcMain
} = require('electron');
const expressApp = express()
const tankionline = require("tankionline.js");
const rootIsDev = isDev? "." : process.resourcesPath + "/app.asar/public/";
let win;
// Functions
function compareVersions(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const longestLength = (v1.length > v2.length) ? v1.length : v2.length;
    for (let i = 0; i < longestLength; i++) {
        if (v1[i] != v2[i]) {
            return (v1 > v2) ? true : false
        }
    }
    return false;
}

function sendStatusToWindow(text) {
    logger.log(text);
    win.webContents.send('message', text);
}

function createAboutWindow() {
    win = new BrowserWindow({
        width: 530,
        height: 180,
        backgroundColor: '#383c4a',
        autoHideMenuBar: true,
        useContentSize: true,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true
        },
    });
    win.on('closed', () => {
        win = null;
    });
    win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
    return win;
}

// Express
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.use(express.static('public'));
expressApp.set('view engine', 'ejs');
expressApp.use(express.urlencoded({
    extended: false
}))

// // Auto updater
// logger.log('Updater starting...');

// autoUpdater.on('checking-for-update', () => {
//     sendStatusToWindow('Checking for update...');
// })
// autoUpdater.on('update-available', (info) => {
//     logger.log(info)
//     sendStatusToWindow('Update available.');
// })
// autoUpdater.on('update-not-available', (info) => {
//     sendStatusToWindow('Update not available.');
//     logger.log(info)
//     win.close();
// })
// autoUpdater.on('error', (err) => {
//     logger.log(err)
//     sendStatusToWindow('Error in auto-updater. ' + err);
//     win.close();
// })
// autoUpdater.on('download-progress', (progressObj) => {
//     const log_message = "Downloading: " + progressObj.transferred + "/" + progressObj.total + " | " + progressObj.percent + "% " + "(" + progressObj.bytesPerSecond + "/s)"
//     sendStatusToWindow(log_message);
// })
// autoUpdater.on('update-downloaded', (info) => {
//     sendStatusToWindow('Update downloaded');
//     setTimeout(function() {
//         autoUpdater.quitAndInstall();
//     }, 5000)
// });

// Main window
let mainWindow;
let tray = null
app.on('ready', function() {
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
    mainWindow.on('minimize', function(event) {
        event.preventDefault();
        mainWindow.hide();
    });

    const contextMenu = Menu.buildFromTemplate([{
        label: 'Show App',
        click: function() {
            mainWindow.show();
        }
    }, {
        label: 'About',
        click: function() {
            createAboutWindow();
        }
    }, {
        label: 'Quit',
        click: function() {
            app.isQuiting = true;
            app.quit();
        }
    }]);
    tray.setContextMenu(contextMenu)
        // autoUpdater.checkForUpdatesAndNotify();
    mainWindow.on('closed', function() {
        app.quit();
    });
})

// Router
// GET REQUESTS
expressApp.get('/', async(req, res, next) => {
    res.render('mainWindow', {
        css: rootIsDev + '/css/materialize.min.css',
        js: rootIsDev + '/js/materialize.min.js',
        version: require('./package.json').version
    });
});

expressApp.get('/setup', (req, res, next) => {
    res.render('setupWindow', {
        css: rootIsDev + '/css/materialize.min.css',
        js: rootIsDev + '/js/materialize.min.js',
        name: store.get('name') ? store.get('name') : "GeopJr",
        size: store.get('size') ? store.get('size') : "big",
        logo: store.get('logo') ? store.get('logo') : "normal"
    });
});

expressApp.get('/check', async(req, res, next) => {
    let updateAvailable = "";
    try {
        const json = await fetch('https://api.github.com/repos/GeopJr/discord-tanki/releases/latest').then(res => res.json())
        if (compareVersions(json.tag_name, `v${app.getVersion()}`)) {
            if (process.platform === "win32") {
                for (let i = 0; i < json.assets.length; i++) {
                    if (json.assets[i].browser_download_url.endsWith(".exe")) {
                        updateAvailable = json.assets[i].browser_download_url
                    }
                }
            } else if (process.platform !== "win32" || updateAvailable.length === 0) {
                updateAvailable = json.html_url
            }
        }
    } catch (err) {
        logger.log(err)
    }
    res.send(updateAvailable)
})

// RPC
expressApp.get('/rpc', (req, res, next) => {
    try {
        if (store.get('size') === "small" || store.get('size') === "big") {
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
                    webSecurity: false,
                    nodeIntegration: true
                },
                autoHideMenuBar: true,
                useContentSize: true,
                resizable: true,
                backgroundColor: '#383c4a'
            });
            newWindow.loadURL("http://localhost:5000/setup")
        }
    } catch (err) {
        logger.log(err)
        newWindow = new BrowserWindow({
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true
            },
            autoHideMenuBar: true,
            useContentSize: true,
            resizable: true,
            backgroundColor: '#383c4a'
        });
        newWindow.loadURL("http://localhost:5000/setup")
    }
})

// POST REQUEST
// SETUP
expressApp.post('/setup', async function(req, res) {
    if (!req.body.name) return res.send("Please specify a username")
    const ratings = new tankionline.ratings(req.body.name, 'en');
    try {
        await ratings.stats()
        store.set('name', req.body.name);
        store.set('size', req.body.size);
        store.set('logo', req.body.logo);
        res.send("SAVED! You can now close this window!");
    } catch {
        res.send("User Not Found");
    }
});

// Process
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

process.on("uncaughtException", (err) => {
    logger.log(err);
});

expressApp.on('window-all-closed', () => {
    app.quit();
});

expressApp.listen(5000, function() {
    logger.log('Express running!');
});
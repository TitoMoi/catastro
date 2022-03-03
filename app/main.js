const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const { ipcMain } = require("electron/main");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  const filter = {
    urls: ["http://*/*"],
  };

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `../dist/catastro/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );

  //Register event to use proxy
  ipcMain.on("catastro-use-proxy", (event) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.webContents.session.webRequest.onBeforeSendHeaders(
      filter,
      (details, callback) => {
        details.requestHeaders["Origin"] = "ovc.catastro.meh.es";
        details.headers["Origin"] = "ovc.catastro.meh.es";
        callback({ requestHeaders: details.requestHeaders });
      }
    );
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

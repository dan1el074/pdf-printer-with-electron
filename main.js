const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
let data = {};

let mainWindow = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "/icon.ico"),
    width: 500,
    height: 300,
    maxWidth: 700,
    maxHeight: 580,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  await mainWindow.loadFile("./src/pages/index.html");

  mainWindow.webContents.send("set-printers", printers);
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// menu bar
const menuTemplate = [];
const menu = new Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// recupera informações do frontend
ipcMain.on("set-teste", (event, data) => {
  console.log(data);
});

// TODO: recuperar impressoras
const printers = [
  {
    name: "Samsung 4080",
    formatos: ["Carta", "A4"],
  },
  {
    name: "fax",
    formatos: ["fax"],
  },
];

// recuperar pasta
ipcMain.on("action/showDialog", () => {
  getFolder();
});

async function getFolder() {
  let dialogFolder = await dialog.showOpenDialog({
    defaultPath: app.getPath("desktop"),
  });

  if (dialogFolder.canceled) {
    return false;
  }

  const folder = String(dialogFolder.filePaths).replace("\\\\", "\\");
  const arrayFolder = folder.split("\\");
  const fileName = arrayFolder[arrayFolder.length - 1];

  data.folder = folder;
  mainWindow.webContents.send("set/fileName", fileName);
}

// comandos dos botões da janela
ipcMain.on("app/minimize", () => {
  mainWindow.minimize();
});

ipcMain.on("app/close", () => {
  app.quit();
});

const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");

let window = null;
let data = {
  folder: "",
  fileName: "",
  printers: [],
  printer: "",
};

app.whenReady().then(createWindow);

async function createWindow() {
  window = new BrowserWindow({
    icon: path.join(__dirname, "/icon.ico"),
    width: 500,
    height: 300,
    maxWidth: 500,
    maxHeight: 300,
    resizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  await window.loadFile("./src/pages/index.html");
  // window.webContents.openDevTools();
  getPrinters("wmic printer get name");
}

// comandos dos botões da janela
ipcMain.on("app/minimize", () => {
  window.minimize();
});

ipcMain.on("app/close", () => {
  app.quit();
});

// menu bar
const menuTemplate = [];
const menu = new Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// recupera impressoras
function getPrinters(command) {
  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      return;
    }

    let res = String(stdout).trim();
    printers = res.split(/\r?\n/g);

    for (i = 0; i < printers.length; i++) {
      printers[i] = printers[i].replace("\\r", "").trim();
    }

    let printerIndex = printers.indexOf("Name");
    if (printerIndex != -1) {
      printers.splice(printerIndex, 1);
    }

    data.printers = printers;
    console.log(printers);
    window.webContents.send("set/printers", printers);
  });
}

// recuperar pasta
ipcMain.on("action/showDialog", () => {
  getFolder();
});

async function getFolder() {
  let dialogFolder = await dialog.showOpenDialog({
    defaultPath: app.getPath("desktop"),
  });

  if (dialogFolder.canceled) {
    window.webContents.send("notShow/dialog");
    return false;
  }

  const folder = String(dialogFolder.filePaths).replace("\\\\", "\\");
  const arrayFolder = folder.split("\\");
  const fileName = arrayFolder[arrayFolder.length - 1];

  data.folder = folder;
  data.fileName = fileName;
  window.webContents.send("set/fileName", fileName);
}

// TODO: ler arquivo Excel e pegar os códigos da coluna "A"
// TODO: achar todos os arquivos dentro das respectivas pastas
// TODO: adicionar os PDFs na fila de impressão de forma unitária (+desempenho)
// TODO: imprimir PDFs executando apenas códigos no CMD (Adobe acrobat)
// TODO: build da aplicação

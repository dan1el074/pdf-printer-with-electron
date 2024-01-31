const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const { exec } = require("child_process");
const pdfPrinter = require("pdf-to-printer");
const path = require("path");
const XLSX = require("xlsx");

let window = null;
let running = false;
let data = {
  path: "",
  fileName: "",
  printers: [],
  printer: "",
  codes: [],
};

app.whenReady().then(createWindow);

async function createWindow() {
  window = new BrowserWindow({
    icon: path.join(__dirname, "/icon-def.ico"),
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
    window.webContents.send("set/printers", printers);
  });
}

// recuperar pasta
ipcMain.on("action/showDialog", () => {
  getPath();
});

async function getPath() {
  let dialogPath = await dialog.showOpenDialog({
    defaultPath: app.getPath("desktop"),
  });

  if (dialogPath.canceled) {
    window.webContents.send("notShow/dialog");
    return false;
  }

  const folderPath = String(dialogPath.filePaths).replace("\\\\", "\\");
  const arrayFolder = folderPath.split("\\");
  const fileName = arrayFolder[arrayFolder.length - 1];

  if (arrayFolder[1] === "metaro-server") {
    data.path = "\\" + folderPath;
  } else {
    data.path = folderPath;
  }

  data.fileName = fileName;
  window.webContents.send("set/fileName", fileName);
}

// recupera códigos Excel
ipcMain.on("action/getCodes", () => {
  getCodes();
});

function getCodes() {
  const workbook = XLSX.readFile(data.path);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const resExcel = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const regex = /\d+-?\d+-?(DET)?\d+/;
  let codes = [];
  data.codes = [];

  resExcel.forEach((array) => {
    let apenasCodigos = String(array[0]).match(regex);
    if (apenasCodigos) {
      codes.push(apenasCodigos.input);
    }
  });

  data.codes = codes; // .reverse();
  console.log(data.codes);
}

// run application
ipcMain.on("app/run", (event, printer) => {
  data.printer = printer;
  if (!running) {
    runApplication();
  }
});

function runApplication() {
  running = true;
  let codeFolders = [];
  let startCode = "";
  const arrayDirPath = data.path.split("\\");
  let dirPath = arrayDirPath.pop();
  dirPath = arrayDirPath.join("\\");
  dirPath = dirPath + "\\";

  data.codes.forEach((code) => {
    if (code.includes("-")) {
      startCode = code.split("-")[0];
    } else {
      startCode = code;
    }
    let pathFound = startCode.slice(0, -3);

    if (pathFound.length == 1) {
      pathFound = "0" + pathFound;
    }

    const foundFilePath = `${dirPath}${pathFound}000\\${code}.pdf`;
    codeFolders.push(foundFilePath);
  });

  console.log(codeFolders);
  imprime(codeFolders);
  running = false;
}

async function imprime(codeFolders) {
  for (const path of codeFolders) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    pdfPrinter
      .print(path, { printer: data.printer })
      .then(() => {
        console.log(`Arquivo PDF impresso com sucesso em: ${data.printer}`);
      })
      .catch((error) => {
        console.error(`Erro ao imprimir: ${error}`);
      });
  }
}

const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const { exec } = require("child_process");
const { PDFDocument, degrees } = require("pdf-lib");
const fs = require("fs/promises");
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
  temporaryFile: "resources/app/temp/result.pdf",
};

app.whenReady().then(createWindow);

async function createWindow() {
  window = new BrowserWindow({
    icon: path.join(__dirname, "/src/images/icon.ico"),
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
  getPrinters();
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
function getPrinters() {
  const command = "wmic printer get name";
  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      window.webContents.send(
        "message/error",
        "Erro: nenhuma impressora encontrada!"
      );
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

  data.codes = codes;

  if (data.codes.length <= 0) {
    setTimeout(() => {
      window.webContents.send(
        "message/simpleError",
        "Erro: nenhum código encontrado!"
      );
    }, 500);
  }

  running = false;
}

// junta os arquivos PDFs
async function joinPDF(arrayFilesPath) {
  const newPDF = await PDFDocument.create();

  for (const caminhoArquivo of arrayFilesPath) {
    const PDFFile = await fs.readFile(caminhoArquivo);
    const pdf = await PDFDocument.load(PDFFile);
    const pages = await newPDF.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => newPDF.addPage(page));
  }

  const novoPDFBytes = await newPDF.save();
  await fs.writeFile(data.temporaryFile, novoPDFBytes);
  await organizarPDF(data.temporaryFile, data.temporaryFile);
}

// organiza arquivo PDF
async function organizarPDF(inputPath, outputPath) {
  try {
    const inputBytes = await fs.readFile(inputPath);
    const pdfDoc = await PDFDocument.load(inputBytes);
    const numPages = pdfDoc.getPageCount();

    for (let i = 0; i < numPages; i++) {
      const page = pdfDoc.getPage(i);
      const isRetrato = page.getSize().width > page.getSize().height;

      if (isRetrato) {
        page.setRotation(degrees(90));
      }
    }

    const modifiedBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, modifiedBytes);
  } catch (error) {
    setTimeout(() => {
      window.webContents.send(
        "message/error",
        `Erro ao organizar o PDF: ${error}`
      );
    }, 1000);
  }
}

// imprime arquivo PDF
async function imprimeExec() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // const comando = `"C:\\Program Files (x86)\\Adobe\\Reader 9.0\\Reader\\AcroRd32.exe" /n /s /h /t "${data.temporaryFile}" "${data.printer}"`;
  const comando = `"C:\\Program Files\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe" /n /s /h /t "${data.temporaryFile}" "${data.printer}"`;
  exec(comando);

  setTimeout(() => {
    exec(
      'taskkill /F /IM "C:\\Program Files (x86)\\Adobe\\Reader 9.0\\Reader\\AcroRd32.exe"'
    );
    window.webContents.send("message/sucess", "Arquivo impresso com sucesso!");
  }, 5000);
}

// run application
ipcMain.on("app/run", (event, printer) => {
  data.printer = printer;
  if (!running) {
    if (data.codes.length <= 0) {
      setTimeout(() => {
        window.webContents.send(
          "message/simpleError",
          "Erro: nenhum código foi encontrado!"
        );
      }, 500);

      return;
    }
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
  window.webContents.send("message/notice", "Processando arquivos");

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

  joinPDF(codeFolders)
    .then(() => {
      setTimeout(() => {
        window.webContents.send(
          "message/sucess",
          "Arquivos PDF combinados com sucesso!"
        );
      }, 500);
    })
    .then(() => {
      setTimeout(() => {
        window.webContents.send("message/notice", "Imprimindo...");
      }, 1000);
      imprimeExec();
    })
    .catch((erro) => {
      setTimeout(() => {
        if (erro.path) {
          window.webContents.send(
            "message/error",
            `Erro! Arquivo não encontrado: ${erro.path}`
          );
        } else {
          window.webContents.send(
            "message/error",
            "Erro ao combinar ou imprimir arquivos!"
          );
        }
      }, 500);
    });
}

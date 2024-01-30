const { ipcRenderer, ipcMain } = require("electron");

const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const newPlaceholder = document.getElementById("new-placeholder");
const printersSelect = document.getElementById("printers");
const inputSearch = document.querySelector(".input-search");
const error = document.getElementById("error");
let showDialog = false;

// mandando att pro backend
searchBtn.addEventListener("click", () => {
  if (!showDialog) {
    ipcRenderer.send("action/showDialog");
    showDialog = true;
  }
});

inputSearch.addEventListener("click", () => {
  if (!showDialog) {
    ipcRenderer.send("action/showDialog");
    showDialog = true;
  }
});

// recebendo att do backend
ipcRenderer.on("set/printers", (event, data) => {
  data.forEach((printer) => {
    printersSelect.innerHTML += `<option value="${printer}">${printer}</option>`;
  });
});

ipcRenderer.on("set/fileName", (event, data) => {
  placeholder.style.display = "none";
  inputSearch.style.border = "2px solid #fff";
  newPlaceholder.style.display = "inline";
  newPlaceholder.innerHTML = data;
  error.style.display = "none";
  showDialog = false;
});

ipcRenderer.on("notShow/dialog", () => {
  showDialog = false;
});

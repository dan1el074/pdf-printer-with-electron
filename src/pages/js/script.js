const { ipcRenderer } = require("electron");

const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const newPlaceholder = document.getElementById("new-placeholder");
const printersSelect = document.getElementById("printers");
const inputSearch = document.querySelector(".input-search");
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
  placeholder.setAttribute("style", "display:none;");
  inputSearch.setAttribute("style", "border:2px solid #fff;transition:0.5s");
  newPlaceholder.setAttribute("style", "display:inline;");
  newPlaceholder.innerHTML = data;
  showDialog = false;
});

ipcRenderer.on("notShow/dialog", () => {
  showDialog = false;
});

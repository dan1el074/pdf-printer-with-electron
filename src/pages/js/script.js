const { ipcRenderer } = require("electron");

const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const newPlaceholder = document.getElementById("new-placeholder");
const printersSelect = document.getElementById("printers");
const inputSearch = document.querySelector(".input-search");

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
});

// mandando att para backend
function eventEmitter() {
  const infomacaoFormulario = "Nova informação de teste.";
  ipcRenderer.send("set-teste", infomacaoFormulario);
}

searchBtn.addEventListener("click", () => {
  ipcRenderer.send("action/showDialog");
});

inputSearch.addEventListener("click", () => {
  ipcRenderer.send("action/showDialog");
});

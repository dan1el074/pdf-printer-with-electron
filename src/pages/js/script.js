const { ipcRenderer } = require("electron");

const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const newPlaceholder = document.getElementById("new-placeholder");

// recebendo att do backend
ipcRenderer.on("set-printers", (event, data) => {
  console.log(data);
});

ipcRenderer.on("set/fileName", (event, data) => {
  placeholder.setAttribute("style", "display:none;");
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

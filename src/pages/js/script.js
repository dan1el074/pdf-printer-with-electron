const { ipcRenderer, ipcMain } = require("electron");

const searchBtn = document.getElementById("search-btn");
const placeholder = document.getElementById("placeholder");
const newPlaceholder = document.getElementById("new-placeholder");
const printersSelect = document.getElementById("printers");
const inputSearch = document.querySelector(".input-search");
const alertContainer = document.querySelector(".alert-container");
let contadorAlert = 0;
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

ipcRenderer.on("message/notice", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("notice");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);

  setTimeout(() => {
    document.getElementById(`alert${contador}`).remove();
  }, 5000);
});

ipcRenderer.on("message/sucess", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("sucess");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);

  setTimeout(() => {
    document.getElementById(`alert${contador}`).remove();
  }, 5000);
});

ipcRenderer.on("message/error", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("erro");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);
});

ipcRenderer.on("message/simpleError", (event, data) => {
  const contador = contadorAlert + 1;
  let div = document.createElement("div");
  div.setAttribute("id", `alert${contador}`);
  div.classList.add("alert");
  div.classList.add("simple-erro");
  div.innerHTML = `<span>${data}</span>`;

  alertContainer.appendChild(div);

  setTimeout(() => {
    document.getElementById(`alert${contador}`).remove();
  }, 5000);
});

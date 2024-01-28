const btnMinimize = document.getElementById("btnMinimize");
const btnClose = document.getElementById("btnClose");

btnMinimize.addEventListener("click", () => {
  ipcRenderer.send("app/minimize");
});

btnClose.addEventListener("click", () => {
  ipcRenderer.send("app/close");
});

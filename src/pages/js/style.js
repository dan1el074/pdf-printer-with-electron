const previousBtn = document.getElementById("previous-btn");
const actionPage = document.querySelector(".action-page");
const nextBtn = document.getElementById("next-btn");
const printBtn = document.getElementById("print-btn");

nextBtn.addEventListener("click", () => {
  const fileSpan = document.getElementById("new-placeholder");
  const regex = /\.[^.]+$/;

  if (fileSpan.innerHTML) {
    if (fileSpan.innerHTML.match(regex) == ".xlsx") {
      actionPage.style.transform = "translateX(-100%)";
      actionPage.style.transition = "0.5s";
      ipcRenderer.send("action/getCodes");
    } else {
      inputSearch.style.border = "2px solid red";
      inputSearch.style.animation =
        "shake 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both";
      error.style.display = "block";
      error.innerHTML = "Arquivo invalido!";
    }
  } else {
    inputSearch.style.border = "2px solid red";
    inputSearch.style.animation =
      "shake 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both";
    error.style.display = "block";
    error.innerHTML = "Selecione um arquivo!";
  }
});

previousBtn.addEventListener("click", () => {
  actionPage.style.transform = "translateX(100%)";
  actionPage.style.transition = "0.5s";
  alertContainer.innerHTML = "";
});

printBtn.addEventListener("click", () => {
  printBtn.style.backgroundColor = "#00E500";
  printBtn.style.transition = "1s";
  const chosenPrinter = document.getElementById("printers").value;
  ipcRenderer.send("app/run", chosenPrinter);
});

printBtn.addEventListener("blur", () => {
  printBtn.style.backgroundColor = "#1689fc";
  printBtn.style.transition = "1s";
});

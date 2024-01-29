const nextBtn = document.getElementById("next-btn");
const previousBtn = document.getElementById("previous-btn");
const actionPage = document.querySelector(".action-page");
const printBtn = document.getElementById("print-btn");

nextBtn.addEventListener("click", () => {
  const fileSpan = document.getElementById("new-placeholder");

  if (fileSpan.innerHTML) {
    actionPage.style.transform = "translateX(-100%)";
    actionPage.style.transition = "0.5s";
  } else {
    inputSearch.style.border = "2px solid red";
    inputSearch.style.animation =
      "shake 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both";
  }
});

previousBtn.addEventListener("click", () => {
  actionPage.style.transform = "translateX(100%)";
  actionPage.style.transition = "0.5s";
});

printBtn.addEventListener("click", () => {
  printBtn.style.backgroundColor = "#00E500";
  printBtn.style.transition = "1s";
});

printBtn.addEventListener("blur", () => {
  printBtn.style.backgroundColor = "blueviolet";
  printBtn.style.transition = "1s";
});

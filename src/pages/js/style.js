const nextBtn = document.getElementById("next-btn");
const previousBtn = document.getElementById("previous-btn");
const actionPage = document.querySelector(".action-page");

nextBtn.addEventListener("click", () => {
  actionPage.setAttribute(
    "style",
    "transform: translateX(-100%);transition: 0.5s;"
  );
});

previousBtn.addEventListener("click", () => {
  actionPage.setAttribute(
    "style",
    "transform: translateX(100%);transition: 0.5s;"
  );
});

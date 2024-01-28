const nextBtn = document.getElementById("next-btn");
const previousBtn = document.getElementById("previous-btn");
const actionPage = document.querySelector(".action-page");

nextBtn.addEventListener("click", () => {
  const fileSpan = document.getElementById("new-placeholder");

  if (fileSpan.innerHTML) {
    actionPage.setAttribute(
      "style",
      "transform: translateX(-100%);transition: 0.5s;"
    );
  } else {
    inputSearch.setAttribute(
      "style",
      "border:2px solid red;animation: shake-horizontal 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;"
    );
  }
});

previousBtn.addEventListener("click", () => {
  actionPage.setAttribute(
    "style",
    "transform: translateX(100%);transition: 0.5s;"
  );
});

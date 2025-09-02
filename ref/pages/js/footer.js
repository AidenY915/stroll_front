const footer = document.createElement("footer");
footer.style.backgroundColor = "#F5F5F5";
footer.style.width = "100vw";
footer.style.minHeight = "300px";
footer.style.border = "1px solid rgba(0,0,0,0.08)";
footer.style.marginTop = "120px";

footer.innerHTML = `
  <div class = "container">
    <img src = "pages/images/footer_templete.png">
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("body").appendChild(footer);
});

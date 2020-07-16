window.onload = () => {
  let menuButton = document.querySelector("#menu-button");
  menuButton.onclick = () => {
    let sheet = document.styleSheets[0];
    let rules = sheet.cssRules || sheet.rules;
    sheet.innerHTML = ""
    let menu = document.querySelector("#header-menu");
    if (menu.style.display === "none") {
      menu.style.display = "flex";
    } else menu.style.display = "none";
  };
};

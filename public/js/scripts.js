window.onload = () => {
  let menuButton = document.querySelector("#menu-button");
  menuButton.onclick = () => {
    let menu = document.querySelector("#header-menu");
    if (menu.style.display === "flex") {
      menu.style.display = "none";
    } else menu.style.display = "flex";
  };
};

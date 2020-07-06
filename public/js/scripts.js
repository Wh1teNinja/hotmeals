window.onload = () => {
  let menuButton = document.querySelector("#menu-button");
  menuButton.onclick = () => {
    console.log(1);
    let menu = document.querySelector("#header-menu");
    if (menu.style.display === "flex") {
      menu.style.display = "none";
    } else menu.style.display = "flex";
  };
};

openFormPopUp = () => {
  let formPopUp = document.querySelector("#form-pop-up");
  formPopUp.style.display = "flex";
};

openLoginForm = () => {
  openFormPopUp();
  let registrationForm = document.querySelector("#registration-form");
  registrationForm.style.display = "none";
  let loginForm = document.querySelector("#login-form");
  loginForm.style.display = "flex";
  let signInButton = document.querySelector("#sign-in");
  let signUpButton = document.querySelector("#sign-up");
  if (signInButton.className.search("off") != -1) {
    signInButton.classList.remove("off");
    signUpButton.classList.add("off");
  }
};

openRegistrationForm = () => {
  openFormPopUp();
  let loginForm = document.querySelector("#login-form");
  loginForm.style.display = "none";
  let registrationForm = document.querySelector("#registration-form");
  registrationForm.style.display = "flex";
  let signInButton = document.querySelector("#sign-in");
  let signUpButton = document.querySelector("#sign-up");
  if (signUpButton.className.search("off") != -1) {
    signInButton.classList.add("off");
    signUpButton.classList.remove("off");
  }
};

openProfileDropDown = () => {
  let profileHeader = document.querySelector("#header-profile");
  if (profileHeader.className === "flex-around") {
    profileHeader.className = "flex-around opened-profile-menu";
  } else profileHeader.className = "flex-around";

  let profileHeaderMenu = document.querySelector(
    "#header-profile-menu"
  );
  if (profileHeaderMenu.style.display === "none") {
    profileHeaderMenu.style.display = "flex";
  } else profileHeaderMenu.style.display = "none";
};

window.onload = () => {
  let menuButton = document.querySelector("#menu-button");
  menuButton.onclick = () => {
    let menu = document.querySelector("#header-menu");
    if (menu.style.display === "flex") {
      menu.style.display = "none";
    } else menu.style.display = "flex";
  };

  let popUp = document.querySelector("#form-pop-up");
  if (popUp) {
    popUp.onclick = (e) => {
      if (e.target !== popUp) return;

      let formPopUp = document.querySelector("#form-pop-up");
      let registrationForm = document.querySelector(
        "#registration-form"
      );
      let loginForm = document.querySelector("#login-form");
      formPopUp.style.display = "none";
      registrationForm.style.display = "none";
      loginForm.style.display = "none";
    };
  }
};

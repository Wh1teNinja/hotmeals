let openFormPopUp = () => {
  let formPopUp = document.querySelector("#form-pop-up");
  formPopUp.style.display = "flex";
};

let openLoginForm = () => {
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

let openRegistrationForm = () => {
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

let openProfileDropDown = () => {
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

let loadPreviewPhoto = (event) => {
  let preview = document.querySelector("#preview-photo");
  preview.src = URL.createObjectURL(event.target.files[0]);
  preview.onload = () => {
    URL.revokeObjectURL(preview.src);
  };
};

let submitForm = (event, form) => {
  event.preventDefault();
  let url = $("#" + form).attr("action");
  let data = $("#" + form).serialize();
  fetch(url, {
    method: "POST",
    body: data,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.done) {
        if (url == "/login") {
          location.reload(true);
        } else {
          location.replace(json.dashboard);
        }
      } else {
        if (json.messages.login) {
          $("#login-email-error").text(
            json.messages.login.email || ""
          );
          $("#login-password-error").text(
            json.messages.login.password || ""
          );
        } else {
          $("#reg-firstName-error").text(
            json.messages.registration.firstName || ""
          );
          $("#reg-lastName-error").text(
            json.messages.registration.lastName || ""
          );
          $("#reg-email-error").text(
            json.messages.registration.email || ""
          );
          $("#reg-pass-error").text(
            json.messages.registration.password || ""
          );
          $("#reg-confPass-error").text(
            json.messages.registration.confirmPassword || ""
          );
        }
      }
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
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
    popUp.onmousedown = (e) => {
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

  if (document.querySelector("#dashboard-profile-form")) {
    let profileInputs = document.querySelectorAll("input[type=text]");
    if (profileInputs) {
      let submitButton = document.querySelector(".submit");
      profileInputs.forEach((profileInput) => {
        profileInput.oninput = () => {
          submitButton.disabled = false;
        };
      });
    }
  }

  if (document.querySelectorAll("#dashboard-profile-form")) {
    let editButtons = document.querySelectorAll(".fa-pen");
    if (editButtons) {
      let cancelButton = document.querySelector(".cancel");
      editButtons.forEach((editButton) => {
        editButton.onclick = () => {
          document.querySelector(
            "#" + editButton.getAttribute("for")
          ).disabled = false;
          editButton.onclick = "";
          cancelButton.disabled = false;
        };
      });
    }
  }
};

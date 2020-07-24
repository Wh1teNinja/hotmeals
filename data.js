const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

messages = {
  login: {
    email: "",
    password: "",
  },
  registration: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};

module.exports.validateLogin = function (data) {
  data.messages = {
    login: {},
  };
  return new Promise((resolve, reject) => {
    let flag = true;
    if (data.email.length === 0) {
      data.messages.login.email = "Please enter your email";
      flag = false;
    }
    if (data.password.length === 0) {
      data.messages.login.password = "Please enter your password";
      flag = false;
    }
    if (flag) {
      resolve();
    } else {
      reject(data);
    }
  });
};

module.exports.validateRegistration = (data) => {
  data.messages = {
    registration: {},
  };
  return new Promise((resolve, reject) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const pasRegex = /^(?=[a-zA-Z\d])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?&])[a-zA-Z\d@$!%*#?&.,<>]{8,32}$/;
    if (data.firstName.length === 0) {
      data.messages.registration.firstName =
      "Please enter your first name";
    }
    
    if (data.lastName.length === 0) {
      data.messages.registration.lastName =
      "Please enter your last name";
    }

    if (data.email.length === 0) {
      data.messages.registration.email = "Please enter your email";
    } else if (!emailRegex.test(data.email)) {
      data.messages.registration.email =
        "Please enter email in the correct form";
    }

    if (data.password.length === 0) {
      data.messages.registration.password =
        "Please enter your password";
    } else if (
      data.password.length > 32 ||
      data.password.length < 8
    ) {
      data.messages.registration.password =
        "Password should be from 8 to 32 characters";
    } else if (!pasRegex.test(data.password)) {
      data.messages.registration.password =
        "Password should have at least one lowercase letter, one uppercase letter, one number and one special symbol";
    }

    if (data.confirmPassword.length === 0) {
      data.messages.registration.confirmPassword =
        "Please confirm your password";
    } else if (data.confirmPassword != data.password) {
      data.messages.registration.confirmPassword =
        "Passwords should match";
    }

    if (
      data.messages.registration.firstName ||
      data.messages.registration.lastName ||
      data.messages.registration.email ||
      data.messages.registration.password ||
      data.messages.registration.confirmPassword
    ) {
      reject(data);
    } else {
      resolve(data);
    }
  });
};

module.exports.sendWelcomeEmail = (data) => {
  return new Promise((resolve, reject) => {
    const msg = {
      to: `${data.email}`,
      from: "afedchenko@myseneca.ca",
      subject: "Successful Registration",
      html: `<strong>Thank you, ${data.firstName} ${data.lastName}, for choosing our meal delivery service!</strong>`,
    };
    sgMail
      .send(msg)
      .then(() => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

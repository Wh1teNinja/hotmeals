//Student: Andrei Fedchenko
//ID: 159867183
//email: afedchenko@senecacollege.ca
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

require("dotenv").config({ path: "./config/.env" });

const topMealsDB = require("./model/topmealsDB.js");
const packagesDB = require("./model/packagesDB.js");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  let topMeals = topMealsDB();
  res.render("home", {
    title: "Home",
    topMeals,
  });
});

app.get("/meal-packages", (req, res) => {
  let packages = packagesDB();
  res.render("meal-packages", {
    title: "Packages",
    packages,
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

app.post("/login", (req, res) => {
  let messages = {
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

  if (req.body.email.length === 0) {
    messages.login.email = "Please enter your email";
  }

  if (req.body.password.length === 0) {
    messages.login.password = "Please enter your password";
  }

  res.render("login", {
    title: "Login",
    messages: messages,
  });
});

app.post("/registration", (req, res) => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  let messages = {
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

  if (req.body.firstName.length === 0) {
    messages.registration.firstName = "Please enter your first name";
  }

  if (req.body.lastName.length === 0) {
    messages.registration.lastName = "Please enter your last name";
  }

  if (req.body.email.length === 0) {
    messages.registration.email = "Please enter your email";
  } else if (
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      req.body.email
    )
  ) {
    messages.registration.email = "Please enter correct email";
  }

  if (req.body.password.length === 0) {
    messages.registration.password = "Please enter your password";
  } else if (
    req.body.password.length > 32 ||
    req.body.password.length < 8
  ) {
    messages.registration.password =
      "Password should be from 8 to 32 characters";
  } else if (
    !/^(?=[a-zA-Z\d])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?&])[a-zA-Z\d@$!%*#?&.,<>]{8,32}$/.test(
      req.body.password
    )
  ) {
    messages.registration.password =
      "Password should have at least one lowercase letter, one uppercase letter, one number and one special symbol";
  }

  if (req.body.confirmPassword.length === 0) {
    messages.registration.confirmPassword =
      "Please confirm your password";
  } else if (req.body.confirmPassword != req.body.password) {
    messages.registration.confirmPassword =
      "Passwords should be identical";
  }

  if (
    messages.registration.firstName ||
    messages.registration.lastName ||
    messages.registration.password ||
    messages.registration.email ||
    messages.registration.confirmPassword
  ) {
    res.render("login", {
      title: "Login",
      messages: messages,
    });
  } else {
    const msg = {
      to: `${req.body.email}`,
      from: "afedchenko@myseneca.ca",
      subject: "Successful Registration",
      html: `<strong>Thank you, ${req.body.firstName} ${req.body.lastName}, for choosing our meal delivery service!</strong>`,
    };
    sgMail.send(msg).then(() => {
      res.render("dashboard", {
        title: "Welcome!",
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
    })
    .catch(err=>{
        console.log(`Error ${err}`);
    });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Web Server is running!");
});

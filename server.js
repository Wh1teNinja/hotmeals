//Student: Andrei Fedchenko
//ID: 159867183
//email: afedchenko@myseneca.ca
//github: https://github.com/Wh1teNinja/Hotmeals
//heroku: https://hotmeals.herokuapp.com/
const express = require("express");
const app = express();
const db = require("./model/db");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const clientSessions = require("client-sessions");

db.initialize()
  .then(() => {
    console.log("DB connect successful!");
  })
  .catch((err) => {
    console.log("Error occurred while connecting to db: " + err);
  });

require("dotenv").config({ path: "./config/.env" });

const indexController = require("./controller/index");
const mealPackagesController = require("./controller/meal-packages");
const loginController = require("./controller/login");
const registrationController = require("./controller/registration");
const dashboardController = require("./controller/dashboard");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(
  clientSessions({
    cookieName: "session",
    secret: process.env.sessionKey,
    duration: 50 * 60 * 1000,
    activeDuration: 60 * 1000,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexController);
app.use("/meal-packages", mealPackagesController);
app.use("/login", loginController);
app.use("/registration", registrationController);
app.use("/dashboard", dashboardController);

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect(req.headers.referer.replace(/https?:\/\/[^\/]+/, ""));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Web Server is running!");
});

//Student: Andrei Fedchenko
//ID: 159867183
//email: afedchenko@myseneca.ca
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

require("dotenv").config({ path: "./config/.env" });

const indexController = require("./controller/index");
const mealPackagesController = require("./controller/meal-packages");
const loginController = require("./controller/login");
const registrationController = require("./controller/registration");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexController);
app.use("/meal-packages", mealPackagesController);
app.use("/login", loginController);
app.use("/registration", registrationController);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Web Server is running!");
});

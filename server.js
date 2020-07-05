//Student: Andrei Fedchenko
//ID: 159867183
//email: afedchenko@senecacollege.ca
const express = require("express");
const exphbs = require("express-handlebars");
const topMealsDB = require("./model/topmealsDB.js");
const packagesDB = require("./model/packagesDB.js");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/", (req, res) => {
  let topMeals = topMealsDB();
  res.render("home", {
    title: "Home",
    topMeals,
  });
  const {object} = 1;
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Web Server is running!");
});

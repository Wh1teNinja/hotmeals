const express = require("express")
const router = express.Router();
const topMealsDB = require("../model/topmealsDB.js");

/* GET home page. */
router.get("/", (req, res) => {
  let topMeals = topMealsDB();
  res.render("home", {
    title: "Home",
    topMeals,
  });
});

module.exports = router;
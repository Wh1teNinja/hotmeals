const express = require("express");
const router = express.Router();
const db = require("../model/db");
/* GET home page. */
router.get("/", (req, res) => {
  db.getTopMeals()
    .then((topMeals) => {
      res.render("home", {
        title: "Home",
        topMeals,
      });
    })
    .catch((err) => {
      console.log("Error retrieving meals: " + err);
    });
});

module.exports = router;

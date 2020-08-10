const express = require("express");
const router = express.Router();
const db = require("../model/db");
/* GET home page. */
router.get("/", (req, res) => {
  db.getTopPackages()
    .then((topMeals) => {
      res.render("home", {
        title: "Home",
        user: req.session.user,
        topMeals,
      });
    })
    .catch((err) => {
      console.log("Error retrieving meals: " + err);
    });
});

module.exports = router;

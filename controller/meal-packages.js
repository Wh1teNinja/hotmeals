const express = require("express");
const router = express.Router();
const db = require("../model/db");

router.get("/", (req, res) => {
  db.getPackages()
    .then((packages) => {
      res.render("meal-packages", {
        title: "Packages",
        packages,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log("Error retrieving packages" + err);
    });
});

module.exports = router;

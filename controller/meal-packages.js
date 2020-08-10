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

router.get("/:id", (req, res) => {
  db.getPackageById(req.params.id)
    .then((package) => {
      res.render("package", {
        title: package.name,
        package,
        user: req.session.user,
      });
    })
    .catch((err) => {
      console.log("Error showing package: " + err);
      res.redirect(404, "/404");
    });
});

module.exports = router;

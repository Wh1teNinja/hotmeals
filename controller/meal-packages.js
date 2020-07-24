const express = require("express")
const router = express.Router();
const packagesDB = require("../model/packagesDB.js");

router.get("/", (req, res) => {
  let packages = packagesDB();
  res.render("meal-packages", {
    title: "Packages",
    packages,
  });
});


module.exports = router;
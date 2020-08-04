const express = require("express");
const db = require("../model/db");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.user) {
    let role = !req.session.user.class ? "User" : "Clerk";
    res.render("dashboard", {
      title: "Dashboard",
      user: req.session.user,
      profile: true,
      role: role,
    });
  } else {
    res.redirect("/");
  }
});

router.get("/settings", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/");
  }
});

module.exports = router;

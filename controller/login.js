const express = require("express");
const db = require("../model/db");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

router.post("/", (req, res) => {
  let form = req.body;
  db.validateUserLogin(form)
    .then((user) => {
      res.render("dashboard", {
        title: "Welcome!",
        firstName: user.firstName,
        lastName: user.lastName,
      });
    })
    .catch(() => {
      res.render("login", {
        title: "Login",
        messages: form.messages,
      });
    });
});

module.exports = router;

const express = require("express");
const data = require("../emailSender");
const db = require("../model/db");
const router = express.Router();

router.post("/", (req, res) => {
  let form = req.body;
  db
    .addUser(form)
    .then(() => {
      data
        .sendWelcomeEmail(form)
        .then(() => {
          res.render("dashboard", {
            title: "Welcome!",
            firstName: form.firstName,
            lastName: form.lastName,
          });
        })
        .catch((err) => {
          console.log(`Error ${err}`);
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

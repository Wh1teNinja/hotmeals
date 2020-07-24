const express = require("express");
const data = require("../data");
const router = express.Router();

router.post("/", (req, res) => {
  let form = req.body;
  data
    .validateRegistration(form)
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

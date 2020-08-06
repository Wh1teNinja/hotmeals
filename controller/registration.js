const express = require("express");
const sender = require("../emailSender");
const db = require("../model/db");
const router = express.Router();

router.post("/", (req, res) => {
  let form = req.body;
  db.addUser(form)
    .then(() => {
      sender
        .sendWelcomeEmail(form)
        .then((user) => {
          req.session.user = user;
          res.redirect("/dashboard");
        })
        .catch((err) => {
          console.log(`Error ${err}`);
        });
    })
    .catch(() => {
      let view = form.title === "Home" ? "home" : "meal-packages";
      res.render(view, {
        title: form.title,
        messages: form.messages,
      });
    });
});

module.exports = router;

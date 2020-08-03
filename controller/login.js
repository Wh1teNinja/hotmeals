const express = require("express");
const db = require("../model/db");
const router = express.Router();

router.post("/", (req, res) => {
  let form = req.body;
  db.validateUserLogin(form)
    .then((user) => {
      req.session.user = user;
      let view = form.title === "Home" ? "home" : "meal-packages";
      res.render(view, {
        title: form.title,
        user: req.session.user,
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

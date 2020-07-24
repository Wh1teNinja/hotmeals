const express = require("express");
const data = require("../data");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

router.post("/", (req, res) => {
  let form = req.body;
  data
    .validateLogin(form)
    .then(() => {
      res.render("login", {
        title: "Login",
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

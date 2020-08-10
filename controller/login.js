const express = require("express");
const db = require("../model/db");
const router = express.Router();

router.post("/", (req, res) => {
  let form = req.body;
  db.validateUserLogin(form)
    .then((user) => {
      req.session.user = user;
      res.json({done: true});
    })
    .catch((form) => {
      res.json(form);
    });
});

module.exports = router;

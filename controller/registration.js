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
          res.json({done: true, dashboard: req.protocol + "://" +req.get('host') + "/dashboard"});
        })
        .catch((err) => {
          console.log(`Error ${err}`);
          res.json(form);
        });
    })
    .catch(() => {
      res.json(form);
    });
});

module.exports = router;

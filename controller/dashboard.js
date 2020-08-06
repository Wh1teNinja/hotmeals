const express = require("express");
const db = require("../model/db");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/images/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    return cb(new Error('Not an image! Please upload an image.', 400), false);
  }
}

const upload = multer({storage:storage, fileFilter: imageFilter});

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

router.get("/packages", (req, res) => {
  if (req.session.user) {
    if (req.session.user.accessLevel) {
      let role = !req.session.user.class ? "User" : "Clerk";
      res.render("dashboard", {
        title: "Dashboard",
        user: req.session.user,
        packages: true,
        role: role,
      });
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/");
  }
});

router.post("/add-package", upload.single("photo"), (req, res) => {
  req.body.photo = req.file.filename;
  db.addMeal(req.body).then(() => {
    console.log("Package saved");
    res.redirect("/dashboard");
  }).catch(err => {
    console.log(err);
    res.redirect("/dashboard/packages");
  })
});

module.exports = router;

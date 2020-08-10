const express = require("express");
const db = require("../model/db");
const path = require("path");
const multer = require("multer");
const { resolve } = require("path");
const { route } = require(".");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/images/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    return cb(
      new Error("Not an image! Please upload an image.", 400),
      false
    );
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

checkUser = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};

router.get("/", checkUser, (req, res) => {
  let role = !req.session.user.class ? "User" : "Clerk";
  res.render("dashboard", {
    title: "Dashboard",
    user: req.session.user,
    profile: true,
    role: role,
  });
});

router.post("/", checkUser, (req, res) => {
  if (req.body.cancel) {
    res.redirect("/dashboard");
  } else {
    let role = !req.session.user.class ? "User" : "Clerk";
    db.updateUserProfile(req.body, req.session.user._id)
      .then((user) => {
        req.session.user = user;
        res.redirect("/dashboard");
      })
      .catch((form) => {
        console.log(form);
        res.render("dashboard", {
          title: "Dashboard",
          user: req.session.user,
          profile: true,
          role: role,
          messages: form.messages,
        });
      });
  }
});

router.get("/settings", checkUser, (req, res) => {
  let role = !req.session.user.class ? "User" : "Clerk";
  res.render("dashboard", {
    title: "Dashboard",
    user: req.session.user,
    profileSettings: true,
    role: role,
  });
});

router.post("/settings", checkUser, (req, res) => {
  let role = !req.session.user.class ? "User" : "Clerk";
  db.updateUserPassword(req.body, req.session.user._id)
    .then(() => {
      res.render("dashboard", {
        title: "Dashboard",
        user: req.session.user,
        profileSettings: true,
        role: role,
        success: true,
      });
    })
    .catch((form) => {
      res.render("dashboard", {
        title: "Dashboard",
        user: req.session.user,
        profileSettings: true,
        role: role,
        messages: form.messages,
      });
    });
});

router.get("/packages", checkUser, (req, res) => {
  if (req.session.user.accessLevel) {
    db.getPackages()
      .then((packages) => {
        let role = !req.session.user.accessLevel;
        res.render("dashboard", {
          title: "Dashboard",
          user: req.session.user,
          packages: packages,
          role: role,
        });
      })
      .catch((err) => {
        console.log("Error retrieving packages" + err);
      });
  } else {
    res.redirect("/dashboard");
  }
});

router.get("/add-package", checkUser, (req, res) => {
  if (req.session.user.accessLevel) {
    let role = !req.session.user.accessLevel ? "User" : "Clerk";
    res.render("dashboard", {
      title: "Dashboard",
      user: req.session.user,
      addPackage: true,
      role: role,
    });
  } else {
    res.redirect("/dashboard");
  }
});

router.post("/add-package", upload.single("photo"), (req, res) => {
  let role = !req.session.user.accessLevel ? "User" : "Clerk";
  if (req.file) {
    req.body.photo = req.file.filename;
    db.addMeal(req.body)
      .then(() => {
        console.log("Package saved");
        res.render("dashboard", {
          title: "Dashboard",
          user: req.session.user,
          addPackage: true,
          role: role,
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/dashboard/add-package");
      });
  }
});

router.get("/edit/:id", (req, res) => {
  if (req.session.user.accessLevel) {
    let role = !req.session.user.accessLevel ? "User" : "Clerk";
    db.getPackageById(req.params.id)
      .then((package) => {
        res.render("dashboard", {
          title: "Dashboard",
          user: req.session.user,
          addPackage: true,
          package: package,
          role: role,
        });
      })
      .catch((err) => {
        console.log("Error fetching package: " + err);
        res.redirect(404, "/404");
      });
  } else {
    res.redirect("/dashboard");
  }
});

router.post("/edit/:id", (req, res) => {
  db.updateMeal(req.body, req.params.id)
    .then((data) => {
      let role = !req.session.user.accessLevel ? "User" : "Clerk";
      console.log("Package updated");
      res.render("dashboard", {
        title: "Dashboard",
        user: req.session.user,
        addPackage: true,
        package: data,
        role: role,
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/dashboard/edit/" + req.params.id);
    });
});

module.exports = router;

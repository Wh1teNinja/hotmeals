const express = require("express");
const router = express.Router();
const db = require("../model/db");

function calculateTotal(cart) {
  return cart.reduce(
    (accumulator, package) =>
      accumulator + package.quantity * package.price,
    0
  );
}

router.get("/", (req, res) => {
  if (req.session.user) {
    db.getPackages()
      .then((packages) => {
        req.session.cart = req.session.cart.map((cartPackage) => {
          cartPackage.price = packages.find(
            (package) => cartPackage.id == package._id
          ).price;
          return cartPackage;
        });
        let cart = packages.filter((package) =>
          req.session.cart.find((cartPackage) => {
            package.quantity = cartPackage.quantity;
            return cartPackage.id == package._id;
          })
        );
        res.render("cart", {
          title: "Cart",
          cart: cart,
          user: req.session.user,
          totalPrice: calculateTotal(cart),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/");
  }
});

router.post("/", (req, res) => {
  if (req.session.user) {
    let index = req.session.cart.findIndex(
      (cartPackage) => cartPackage.id == req.body.id
    );
    if (index != -1) {
      req.session.cart[index].quantity++;
    } else {
      req.session.cart.push({
        id: req.body.id,
        quantity: 1,
      });
    }
    res.json({
      size: req.session.cart.reduce(
        (accumulator, package) => accumulator + package.quantity,
        0
      ),
    });
  }
});

router.delete("/", (req, res) => {
  if (req.session.user) {
    let index = req.session.cart.findIndex(
      (package) => package.id == req.body.id
    );
    req.session.cart.splice(index, 1);
    res.json({
      totalPrice: calculateTotal(req.session.cart),
      size: req.session.cart.reduce(
        (accumulator, package) => accumulator + package.quantity,
        0
      ),
    });
  }
});

router.get("/size", (req, res) => {
  if (req.session.user) {
    res.json({
      size: req.session.cart.reduce(
        (accumulator, package) => accumulator + package.quantity,
        0
      ),
    });
  }
});

router.post("/size", (req, res) => {
  req.session.cart[
    req.session.cart.findIndex((package) => package.id == req.body.id)
  ].quantity = req.body.quantity;
  res.json({
    totalPrice: calculateTotal(req.session.cart),
    size: req.session.cart.reduce(
      (accumulator, package) => accumulator + package.quantity,
      0
    ),
  });
});

router.post("/checkout", (req, res) => {
  req.session.cart = [];
  res.json({ size: 0 });
});

module.exports = router;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("dotenv").config({ path: "./config/.env" });

let mealSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  numberOfOrders: Number,
});

let userSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  password: String,
});

let packageSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  category: Number,
  noOfmeals: Number,
  desc: String,
});

let Users;
let Meals;
let Packages;

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    db = mongoose.createConnection(
      `mongodb+srv://Admin:${process.env.dbpass}@hotmeals.qlqlb.mongodb.net/hotmeals?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    db.on("error", (err) => {
      reject(err);
    });

    db.once("open", () => {
      Meals = db.model("meals", mealSchema);
      Packages = db.model("packages", packageSchema);
      resolve();
    });
  });
};

module.exports.getTopMeals = () => {
  return new Promise((resolve, reject) => {
    Meals.find()
      .exec()
      .then((meals) => {
        resolve(meals.map((meal) => meal.toObject()));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getPackages = () => {
  return new Promise((resolve, reject) => {
    Packages.find()
      .exec()
      .then((package) => {
        resolve(package.map((package) => package.toObject()));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

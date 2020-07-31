const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
      Users = db.model("users", userSchema);
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

module.exports.getUser = (data) => {
  return new Promise((resolve, reject) => {
    Users.find(data)
      .exec()
      .then((user) => {
        if (user.length == 0) {
          reject("No User Found!");
        } else {
          resolve(user.map((m_user) => m_user.toObject()));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.addUser = (data) => {
  return new Promise((resolve, reject) => {
    let newUser = new Users(data);
    this.validateUserRegistration(data)
      .then(() => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;

            newUser.save((err) => {
              if (err) {
                console.log("There was an error saving user: " + err);
                reject(data);
              } else {
                console.log("User saved.");
                resolve();
              }
            });
          });
        });
      })
      .catch(() => {
        reject(data);
      });
  });
};

module.exports.validateUserRegistration = (data) => {
  return new Promise((resolve, reject) => {
    data.messages = {
      registration: {},
    };
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const pasRegex = /^(?=[a-zA-Z\d])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?&])[a-zA-Z\d@$!%*#?&.,<>]{8,32}$/;
    if (data.firstName.length === 0) {
      data.messages.registration.firstName =
        "Please enter your first name";
    }

    if (data.lastName.length === 0) {
      data.messages.registration.lastName =
        "Please enter your last name";
    }

    if (data.email.length === 0) {
      data.messages.registration.email = "Please enter your email";
    } else if (!emailRegex.test(data.email)) {
      data.messages.registration.email =
        "Please enter email in the correct form";
    }
    if (data.password.length === 0) {
      data.messages.registration.password =
        "Please enter your password";
    } else if (
      data.password.length > 32 ||
      data.password.length < 8
    ) {
      data.messages.registration.password =
        "Password should be from 8 to 32 characters";
    } else if (!pasRegex.test(data.password)) {
      data.messages.registration.password =
        "Password should have at least one lowercase letter, one uppercase letter, one number and one special symbol";
    }

    if (data.confirmPassword.length === 0) {
      data.messages.registration.confirmPassword =
        "Please confirm your password";
    } else if (data.confirmPassword != data.password) {
      data.messages.registration.confirmPassword =
        "Passwords should match";
    }

    if (
      data.messages.registration.firstName ||
      data.messages.registration.lastName ||
      data.messages.registration.email ||
      data.messages.registration.password ||
      data.messages.registration.confirmPassword
    ) {
      reject(data);
    } else {
      this.getUser({ email: data.email })
        .then((user) => {
          data.messages.registration.email =
            "This email is already registered";
          reject(data);
        })
        .catch(() => {
          resolve();
        });
    }
  });
};

module.exports.validateUserLogin = (data) => {
  return new Promise((resolve, reject) => {
    data.messages = {
      login: {},
    };
    let flag = true;
    if (data.email.length === 0) {
      data.messages.login.email = "Please enter your email";
      flag = false;
    }
    if (data.password.length === 0) {
      data.messages.login.password = "Please enter your password";
      flag = false;
    }
    if (flag) {
      data.messages.login.email = "Wrong password or email!";
      this.getUser({ email: data.email })
        .then((user) => {
          bcrypt
            .compare(data.password, user[0].password)
            .then((res) => {
              if (res) {
                resolve(user[0]);
              } else {
                reject(data);
              }
            })
            .catch((err) => {
              console.log(err);
              reject(data);
            });
        })
        .catch((err) => {
          console.log(err);
          reject(data);
        });
    } else {
      reject(data);
    }
  });
};

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

require("dotenv").config({ path: "./config/.env" });

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const pasRegex = /^(?=[a-zA-Z\d])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?&])[a-zA-Z\d@$!%*#?&.,<>]{8,32}$/;

let userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  password: String,
  accessLevel: Number,
  phoneNo: String,
  address: String,
});

let packageSchema = new Schema({
  name: String,
  photo: String,
  price: Number,
  category: String,
  noOfMeals: Number,
  desc: String,
  topPackage: Boolean,
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
      Packages = db.model("packages", packageSchema);
      Users = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.getTopPackages = () => {
  return new Promise((resolve, reject) => {
    Packages.find({ topPackage: true })
      .exec()
      .then((package) => {
        resolve(package.map((package) => package.toObject()));
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

module.exports.getPackageById = (id) => {
  return new Promise((resolve, reject) => {
    Packages.findOne({ _id: id })
      .exec()
      .then((package) => {
        if (package) {
          resolve(package.toObject());
        } else {
          reject("No package found with this id");
        }
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
            newUser.accessLevel = 0;
            newUser.phoneNo = "";
            newUser.address = "";
            newUser.save((err) => {
              if (err) {
                console.log("There was an error saving user: " + err);
                reject(data);
              } else {
                console.log("User saved.");
                resolve(newUser);
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

module.exports.updateUserProfile = (data, id) => {
  return new Promise((resolve, reject) => {
    data.messages = {
      profile: {},
    };
    let user = {};
    console.log();
    if (data.firstName != undefined) {
      if (data.firstName.length != 0) {
        user.firstName = data.firstName;
      } else {
        data.messages.profile.firstName = "First Name is required";
      }
    }

    if (data.lastName != undefined) {
      if (data.lastName && data.lastName.length != 0) {
        user.lastName = data.lastName;
      } else {
        data.messages.profile.lastName = "Last Name is required";
      }
    }
    if (data.phoneNo) user.phoneNo = data.phoneNo;
    if (data.address) user.address = data.address;

    if (
      data.messages.profile.firstName ||
      data.messages.profile.lastName
    ) {
      reject(data);
    } else {
      Users.updateOne(
        { _id: id },
        {
          $set: user,
        }
      )
        .exec()
        .then(() => {
          console.log("User Updated");
          this.getUser({ _id: id })
            .then((user) => {
              resolve(user[0]);
            })
            .catch(() => {
              reject(data);
            });
        })
        .catch(() => {
          reject(data);
        });
    }
  });
};

function validateNewPassword(data) {
  return new Promise((resolve, reject) => {
    if (data.newPassword.length === 0) {
      data.messages.update.newPassword =
        "Please enter your new password";
    } else if (
      data.newPassword.length > 32 ||
      data.newPassword.length < 8
    ) {
      data.messages.update.newPassword =
        "Password should be from 8 to 32 characters";
    } else if (!pasRegex.test(data.newPassword)) {
      data.messages.update.newPassword =
        "Password should have at least one lowercase letter, one uppercase letter, one number and one special symbol";
    }

    if (data.newPasswordConfirm.length === 0) {
      data.messages.update.newPasswordConfirm =
        "Please confirm your new password";
    } else if (data.newPasswordConfirm != data.newPassword) {
      data.messages.update.newPasswordConfirm =
        "Passwords should match";
    }
    if (
      data.messages.update.newPasswordConfirm ||
      data.messages.update.newPassword
    ) {
      reject(data);
    } else {
      resolve(data);
    }
  });
}

module.exports.updateUserPassword = (data, id) => {
  return new Promise((resolve, reject) => {
    this.getUser({ _id: id })
      .then((user) => {
        data.messages = {
          update: {},
        };
        bcrypt
          .compare(data.currentPassword, user[0].password)
          .then((res) => {
            if (res) {
              validateNewPassword(data)
                .then((data) => {
                  bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(
                      data.newPassword,
                      salt,
                      (err, hash) => {
                        Users.updateOne(
                          { _id: id },
                          {
                            $set: { password: hash },
                          }
                        )
                          .exec()
                          .then(() => {
                            console.log("Password updated!");
                            resolve();
                          })
                          .catch((err) => {
                            reject(data);
                          });
                      }
                    );
                  });
                })
                .catch(() => {
                  reject(data);
                });
            } else {
              data.messages.update.currentPassword =
                "Wrong password!";
              reject(data);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(data);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.addMeal = (data) => {
  return new Promise((resolve, reject) => {
    if (
      data.name &&
      data.price &&
      data.desc &&
      data.noOfMeals &&
      data.category &&
      data.photo
    ) {
      data.topPackage = data.topPackage == "on" ? true : false;
      let newPackage = new Packages(data);
      newPackage.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      reject(data);
    }
  });
};

module.exports.updateMeal = (data, id) => {
  return new Promise((resolve, reject) => {
    data.topPackage = data.topPackage == "on" ? true : false;
    console.log(data);
    Packages.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(this.getPackageById(id));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

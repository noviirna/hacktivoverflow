const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { hashPassword } = require("../helpers/password");

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    minlength: [4, "username must consist of 4-16 character"],
    maxlength: [16, "username must consist of 4-16 character"],
    validate: [
      {
        validator: function(username) {
          return this.model("User")
            .findOne({
              username
            })
            .then(result => {
              if (result) {
                return false;
              } else {
                return true;
              }
            })
            .catch(err => {
              return false;
            });
        },
        message: "that username already been used"
      },
      {
        validator: function(username) {
          if (username.match(/^[A-Za-z0-9]+$/)) {
            return true;
          } else {
            return false;
          }
        },
        message: "username cannot be having any special character"
      }
    ]
  },
  email: {
    type: String,
    validate: [
      {
        validator: function(email) {
          let re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(email).toLowerCase());
        },
        message: "please input a valid email address"
      },
      {
        validator: function(email) {
          return this.model("User")
            .findOne({
              email
            })
            .then(result => {
              if (result) {
                return false;
              } else {
                return true;
              }
            })
            .catch(err => {
              return false;
            });
        },
        message: "that email already been used"
      }
    ]
  },
  password: {
    type: String,
    minlength: [8, "password must consist of 8 - 16 character"],
    maxlength: [16, "password must consist of 8 - 16 character"],
    required: true
  },
  watchedTags: [String]
});

UserSchema.pre("save", function(next) {
  this.password = hashPassword(this.password);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

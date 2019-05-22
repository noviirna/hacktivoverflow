const User = require(`../models/user`);
const { comparePassword } = require(`../helpers/password`);
const { generateToken } = require(`../helpers/token`);

class cUser {
  static register(req, res) {
    User.create(req.body)
      .then(created => {
        res.status(201).json(created);
      })
      .catch(err => {
        res.status(400).json({ message: `internal server error => ${err}` });
        console.log("register gagal => ", err);
      });
  }

  static login(req, res) {
    User.findOne({ email: req.body.email })
      .then(found => {
        if (found) {
          if (comparePassword(req.body.password, found.password) === true) {
            let token = generateToken(found._id, found.email);
            let user = found._id;
            res.status(200).json({ token, user });
          } else {
            res.status(400).json({ message: `password / email wrong` });
          }
        } else {
          res.status(400).json({ message: `password / email wrong` });
        }
      })
      .catch(err => {
        res.status(500).json({ message: `internal server error` });
        console.log("login gagal => ", err);
      });
  }

  static getuser(req, res) {
    User.findById(req.params.id)
      .then(found => {
        if (found) {
          res.send(found.username);
        } else {
          res.send(null);
        }
      })
      .catch(err => {
        res.status(500).json({ message: `internal server error` });
        console.log("login gagal => ", err);
      });
  }
}

module.exports = cUser;

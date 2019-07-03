const User = require(`../models/user`);
const { comparePassword } = require(`../helpers/password`);
const { generateToken } = require(`../helpers/token`);

class Controller {
  static register(req, res, next) {
    User.create(req.body)
      .then(created => {
        res.status(201).json(created);
      })
      .catch(next);
  }

  static login(req, res, next) {
    User.findOne({ email: req.body.email })
      .then(found => {
        if (found) {
          if (comparePassword(req.body.password, found.password) === true) {
            let { _id, email, username, watchedTags } = found;
            let token = generateToken({ _id, email, username });
            let user = { _id, email, username, watchedTags };
            res.status(200).json({ token, user });
          } else {
            next({ code: 400, message: `password / email wrong` });
          }
        } else {
          next({ code: 400, message: `password / email wrong` });
        }
      })
      .catch(next);
  }
}

module.exports = Controller;

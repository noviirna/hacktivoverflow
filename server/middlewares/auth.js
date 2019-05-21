const jwt = require(`jsonwebtoken`);
const Question = require(`../models/question`);
const Answer = require(`../models/answer`)
const { decodeToken } = require(`../helpers/token`);

function authentication(req, res, next) {
  try {
    let decoded = jwt.verify(req.headers.token, process.env.SECRET_JWT);
    next();
  } catch (err) {
    res.status(403).json({
      message: `authentication failed, you have to login first`
    });
  }
}

function authorizationq(req, res, next) {
  let condition = {
    _id: req.params.id,
    userId: req.headers.id
  };
  Question.findOne(condition)
    .then(result => {
      if (result) {
        next();
      } else {
        res.status(403).json({
          message: `authorization failed, you have no rights to access this`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Internal server error`
      });
    });
}

function authorizationa(req, res, next) {
  let condition = {
    _id: req.params.id,
    userId: req.headers.id
  };
  Answer.findOne(condition)
    .then(result => {
      if (result) {
        next();
      } else {
        res.status(403).json({
          message: `authorization failed, you have no rights to access this`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: `Internal server error`
      });
    });
}

module.exports = {
  authentication,
  authorizationq,
  authorizationa
};

const jwt = require(`jsonwebtoken`);
const Question = require(`../models/question`);
const Answer = require(`../models/answer`);

function authentication(req, res, next) {
  console.log("here 1");

  try {
    let decoded = jwt.verify(req.headers.token, process.env.SECRET_JWT);
    req.user = decoded;
    console.log("here 2");
    next();
  } catch (err) {
    console.log("here 3");
    next({
      code: 403,
      message: `authentication failed, you have to login first`
    });
  }
}

function authorizationq(req, res, next) {
  let condition = {
    _id: req.params.id,
    userId: req.user._id
  };
  Question.findOne(condition)
    .then(result => {
      if (result) {
        next();
      } else {
        next({
          code: 403,
          message: `authorization failed, you have no rights to access this`
        });
      }
    })
    .catch(err => {
      next({
        code: 403,
        message: `Internal server error`
      });
    });
}

function authorizationa(req, res, next) {
  let condition = {
    _id: req.params.id,
    userId: req.user._id
  };
  Answer.findOne(condition)
    .then(result => {
      if (result) {
        next();
      } else {
        next({
          code: 403,
          message: `authorization failed, you have no rights to access this`
        });
      }
    })
    .catch(err => {
      next({
        code: 403,
        message: `Internal server error`
      });
    });
}

module.exports = {
  authentication,
  authorizationq,
  authorizationa
};

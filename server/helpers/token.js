const jwt = require("jsonwebtoken");

function generateToken(id, email) {
  return jwt.sign({ id, email }, process.env.SECRET_JWT);
}

function decodeToken(token) {
  return jwt.verify(token, process.env.SECRET_JWT);
}

module.exports = {
  generateToken,
  decodeToken
};
const bcrypt = require("bcryptjs");

function hashPassword(str) {
  return bcrypt.hashSync(str, 5);
}

function comparePassword(pass, hash) {
  return bcrypt.compareSync(pass, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};

const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, "secret", { expiresIn: "30d" });
};

module.exports = createToken;

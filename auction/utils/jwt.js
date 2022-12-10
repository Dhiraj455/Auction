const jwt = require("jsonwebtoken");

const maxAge = 1000 * 60 * 1000;
module.exports = {
  generateToken: (user) =>
    jwt.sign({ user }, process.env.JWT_KEY, {
      expiresIn: maxAge,
    }),
  verifyToken: (token) => jwt.verify(token, process.env.JWT_KEY),
  decodeToken: (token) => jwt.decode(token),
};

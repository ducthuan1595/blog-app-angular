const jwt = require("jsonwebtoken");
const User = require("../model/user");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "secret");
      req.user = await User.findById(decoded.id).select("-password");
  // console.log(req.user);

      next();
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: "Not authorized" });
    }
  } else {
    res.status(404).json({ message: "Not found token" });
  }
};

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    return decoded.id;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { protect, verifyToken };

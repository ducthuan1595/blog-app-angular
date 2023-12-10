const User = require("../model/user");
const bcrypt = require("bcrypt");
const createToken = require("../minddleware/token");

exports.login = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        resolve({
          status: 402,
          message: "User is not exist",
        });
      } else {
        const validPs = await bcrypt.compare(password, user.password);
        if (validPs) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              username: user.username,
              email: user.email,
              _id: user.id,
              token: createToken(user._id),
              role: user.role,
            },
          });
        } else {
          resolve({
            status: 301,
            message: "Password is incorrect",
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.loginAdmin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user || user.role === "F1") {
        resolve({
          status: 402,
          message: "Unauthorized",
        });
      } else {
        const validPs = await bcrypt.compare(password, user.password);
        if (validPs) {
          resolve({
            status: 200,
            message: "ok",
            data: {
              name: user.username,
              email: user.email,
              token: createToken(user._id),
              role: user.role,
            },
          });
        } else {
          resolve({
            status: 301,
            message: "Password is incorrect",
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

exports.signup = (username, email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        const pw = await bcrypt.hash(password, 12);
        const newUser = new User({
          username: username,
          email: email,
          password: pw,
          role: "F1",
        });
        const addUser = await newUser.save();
        if (addUser) {
          resolve({
            status: 200,
            message: "ok",
          });
        }
      } else {
        resolve({
          status: 404,
          message: "Email already exist!",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports.getAllUser = async (req, res) => {
  let response = {
    success: true,
    message: "",
    errMessage: "",
    result: "",
  };
  try {
    const result = await User.find({});
    if (result.length > 0) {
      response.success = true;
      response.errMessage = undefined;
      response.message = undefined;
      response.result = result;
    } else {
      response.errMessage = undefined;
      response.message = "No results found";
    }
    return res.status(200).json(response);
  } catch (err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
};

module.exports.deleteUser = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      await User.findOneAndDelete({
        _id: user._id,
      });
      response.success = true;
      response.message = "User deleted successfully";
      res.status(200).json(response);
    } else {
      response.success = false;
      response.message = "User not found";
      res.status(400).json(response);
    }
  } catch (err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
};



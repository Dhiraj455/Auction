const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const Admin_email = process.env.ADMIN_EMAIL;
const Admin_password = process.env.ADMIN_PASSWORD;
const Admin_id = process.env.ADMIN_ID;

module.exports.register = async (req, res) => {
  const response = {
    success: false,
    message: "",
    errMessage: "",
  };
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ message: "Please fill all the fields" });
  }
  if (email == Admin_email) {
    return res.status(422).json({ message: "User already exists" });
  } else {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        return res.json({ message: "User already exists" }).status(200);
      }
      const newUser = new User({
        name,
        email,
        password,
        cpassword,
      });
      await newUser.save();
      response.success = true;
      response.message = "User created successfully";
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  let token = "";
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      if (email == Admin_email && password == Admin_password) {
        token = generateToken({ id: Admin_id, role: "admin" });
        const maxAge = 1000 * 60;
        console.log(token);
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "none",
          signed: true,
          secure: true,
          expires: maxAge,
          maxAge: maxAge * 1000,
        });
        res.json({ message: "Admin Login Successful" });
      }
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      token = await user.generateAuthToken({ id: user._id, role: "user" });
      const maxAge = 1000 * 60;
      console.log(token);
      res.cookie("token", token, {
        signed: true,
        sameSite: "none",
        secure: true,
        expires: maxAge,
        maxAge: maxAge * 1000,
      });
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      } else {
        res.json({ message: "Login Successful" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateUser = async (req, res) => {
  const response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { name, description, email } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          name,
          description,
        },
      },
      { new: true }
    );
    response.success = true;
    response.message = "User updated successfully";
    res.status(200).json(response);
  } catch (err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
};

module.exports.getProfile = async (req, res) => {
  const response = {
    success: false,
    message: "",
    errMessage: "",
    result: "",
  };
  const user = req.user;
  try {
    await User.findOne({ _id: user._id }).then((result) => {
      response.result = result;
      response.success = true;
      res.status(200).json(response);
    });
  }
  catch(err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
}
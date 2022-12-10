const express = require("express");
const router = express.Router();
const CheckIfUser = require("../middlewares/RequiredUser").CheckIfUser;
const auth = require("../middlewares/Authentication");
const userControl = require("../controllers/userController");

router.post("/register", userControl.register);
router.post("/login", userControl.login);

router.use(auth);

router.get("/logout", (req, res) => {
  console.log("Logout");
  res.clearCookie("jwttoken", { path: "/" });
  res.send("Logout Successful");
});

router.get("/profile", CheckIfUser, userControl.getProfile);

module.exports = router;

const express = require("express");
const router = express.Router();
const CheckIfUser = require("../middlewares/RequiredUser").CheckIfUser;
const checkIfAdmin = require("../middlewares/RequiredUser").checkIfAdmin;
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

router.delete("/user_delete", checkIfAdmin, userControl.deleteUser);

router.put("/user_update", CheckIfUser, userControl.updateUser);

module.exports = router;

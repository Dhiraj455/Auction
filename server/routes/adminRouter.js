const express = require("express");
const router = express.Router();
const auth = require("../middlewares/Authentication");
const checkIfAdmin = require("../middlewares/RequiredUser").checkIfAdmin;
const AdminController = require("../controllers/adminController");

router.use(auth);

router.get("/users", checkIfAdmin, AdminController.getAllUser);

module.exports = router;

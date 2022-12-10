const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/Authentication");
const checkIfAdmin = require("../middlewares/RequiredUser").checkIfAdmin;

router.use(auth);

router.post("/create_auction", checkIfAdmin, adminController.createAuction);

module.exports = router;

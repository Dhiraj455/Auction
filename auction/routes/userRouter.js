const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/Authentication");
const CheckIfUser = require("../middlewares/RequiredUser").CheckIfUser;

router.use(auth);

router.put("/bid/:id", CheckIfUser, userController.bidAuction);

module.exports = router;

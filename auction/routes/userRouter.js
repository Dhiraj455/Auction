const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/Authentication");
const CheckIfUser = require("../middlewares/RequiredUser").CheckIfUser;

router.use(auth);

router.put("/bid/:id", CheckIfUser, userController.bidAuction);

router.get("/won_auctions", CheckIfUser, userController.getWonAuction);

module.exports = router;

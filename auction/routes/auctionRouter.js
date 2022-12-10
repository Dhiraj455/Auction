const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/auctionController");
const auth = require("../middlewares/Authentication");
const CheckIfUser = require("../middlewares/RequiredUser").CheckIfUser;

router.use(auth);

router.get("/current_auction", CheckIfUser, auctionController.getCurrentAuctions);

module.exports = router; 
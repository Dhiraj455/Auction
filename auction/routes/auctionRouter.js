const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/auctionController");
const auth = require("../middlewares/Authentication");
const CheckIfUser = require("../middlewares/RequiredUser").CheckIfUser;

router.put("/end_auction/:id", auctionController.endAuction)

router.use(auth);

router.get("/current_auction", CheckIfUser, auctionController.getCurrentAuctions);

router.get("/single_auction/:id", auctionController.getSingleAuction);


module.exports = router; 
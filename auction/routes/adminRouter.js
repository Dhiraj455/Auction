const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/Authentication");
const checkIfAdmin = require("../middlewares/RequiredUser").checkIfAdmin;

router.use(auth);

router.post("/create_auction",checkIfAdmin, adminController.createAuction);

router.get("/all_auctions",checkIfAdmin, adminController.getAllAuctions);

router.put("/update_auction/:id",checkIfAdmin, adminController.updateAuction);

router.delete("/delete_auction/:id",checkIfAdmin, adminController.deleteAuction);

module.exports = router; 

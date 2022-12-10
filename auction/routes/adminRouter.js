const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/Authentication");
const checkIfAdmin = require("../middlewares/RequiredUser").checkIfAdmin;

router.use(auth);
router.use(checkIfAdmin);

router.post("/create_auction", adminController.createAuction);

router.get("/all_auctions", adminController.getAllAuctions);

router.put("/update_auction/:id", adminController.updateAuction);

router.delete("/delete_auction/:id", adminController.deleteAuction);

module.exports = router;

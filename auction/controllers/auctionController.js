const User = require("../models/user");
const Auction = require("../models/auction");

module.exports.getCurrentAuctions = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
    result: "",
  };
  try {
    await Auction.find({ endDate: { $gt: new Date() } })
      .select(
        "name description startingPrice currentPrice endDate startDate highestBidder"
      )
      .then((result) => {
        response.result = result;
        response.success = true;
        res.status(200).json(response);
      });
  } catch (err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
};

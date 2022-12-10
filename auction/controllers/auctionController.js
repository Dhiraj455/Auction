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

module.exports.getSingleAuction = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
    result: "",
  };
  try {
    const { id } = req.params;
    await Auction.findOne({ _id: id })
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

module.exports.endAuction = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { id } = req.params;
    const auction = await Auction.findOne({
      _id: id,
      AuctionLive: true,
      endDate: { $lt: new Date() },
    });
    if (auction) {
      console.log(auction.endDate, new Date());
      await Auction.updateOne(
        { _id: id },
        { $set: { AuctionLive: false, winner: auction.highestBidder } }
      );
      response.success = true;
      response.message = "Auction ended successfully";
      res.status(200).json(response);
    } else {
      response.message = "Auction not found or not ended yet";
      res.status(400).json(response);
    }
  } catch (err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
};

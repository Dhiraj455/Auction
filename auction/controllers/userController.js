const User = require("../models/user");
const Auction = require("../models/auction");

module.exports.bidAuction = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  try {
    const { id } = req.params;
    const { bidAmount } = req.body;
    const user = req.user;
    const auction = await Auction.findOne({
      _id: id,
      endDate: { $gt: new Date() },
    });
    let bids = {
      bidder: "",
      bid: "",
    };
    if (auction) {
      bids["bidder"] = user._id;
      bids["bid"] = bidAmount;
      if (auction.currentPrice < bidAmount) {
        await Auction.updateOne(
          { _id: id },
          {
            $set: {
              currentPrice: bidAmount,
              highestBidder: user._id,
            },
            $push: { bids: bids },
          }
        );
        await auction.save();
        response.success = true;
        response.message = "Bid placed successfully";
        res.status(200).json(response);
      } else {
        response.message = "Bid amount should be greater than current price";
        res.status(400).json(response);
      }
    } else {
      response.message = "Auction not found";
      res.status(400).json(response);
    }
  } catch (err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
};

module.exports.getWonAuction = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
    result: "",
  };
  try {
    const user = req.user;
    await Auction.find({
      endDate: { $lt: new Date() },
      highestBidder: user._id,
      AuctionLive: false,
      winner: user._id,
    })
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

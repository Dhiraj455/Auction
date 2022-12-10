const User = require("../models/user");
const Auction = require("../models/auction");

module.exports.createAuction = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  console.log(req.body);
  try {
    const { name, description, startingPrice, endDate } = req.body;
    const auction = new Auction({
      name,
      description,
      startingPrice,
      currentPrice: startingPrice,
      endDate,
      startDate: new Date(),
    });
    await auction.save();
    response.success = true;
    response.message = "Auction created successfully";
    res.status(200).json(response);
  } catch (err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
};

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
    const end_date = new Date(endDate);
    if (end_date < new Date()) {
      response.message = "End date should be greater than current date";
      return res.status(400).json(response);
    } else {
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
    }
  } catch (err) {
    console.log("Error", err);
    response.message = "Something went wrong!";
    response.errMessage = err.message;
    res.status(400).json(response);
  }
};

module.exports.getAllAuctions = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
    result: "",
  };
  try {
    await Auction.find().then((result) => {
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

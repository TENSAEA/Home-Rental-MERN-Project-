const { json } = require("express");
const House = require("../model/houseModel");
const RentalRequest = require("../model/rentalRequestModel");

exports.createRentalRequest = async (req, res) => {
  try {
    const { house, startDate, endDate } = req.body;
    const tenant = req.user._id;

    const rentalRequest = await RentalRequest.create({
      house,
      startDate,
      endDate,
      tenant,
    });

    res.status(201).json({
      message: "request created successfully!",
      data: rentalRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating request" });
  }
};
exports.listRentalRequests = async (req, res) => {
  let requestedHouses;
  try {
    if (req.user.role === "broker") {
      requestedHouses = await RentalRequest.find({
        status: "pending",
        _id: {
          $in: House.find({
            brocker: req.user._id,
          }).select("_id"),
        },
      });
    } else {
      requestedHouses = await RentalRequest.find({
        status: "pending",
        _id: {
          $in: House.find({
            landlord: req.user._id,
          }).select("_id"),
        },
      });
    }
  } catch (error) {}
};
exports.manageRentalRequest = async (req, res) => {};

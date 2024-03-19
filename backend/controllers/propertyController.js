const { json } = require("express");
const House = require("../model/houseModel");

exports.getAllAvailableProperty = async (req, res) => {
  try {
    let availableHouses = await House.find({
      status: "available",
      approvalStatus: "approved",
    });

    availableHouses = availableHouses.map((house) => {
      if (house.broker) {
        return {
          ...house._doc,
          landlord: undefined,
        };
      }
      return house;
    });
    res.status(200).json(availableHouses);
  } catch (error) {
    console.error("Error finding available houses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllProperty = async (req, res) => {
  try {
    const allhouses = await House.find();
    res.status(200).json({ allhouses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProperty = async (req, res) => {
  try {
    let houses;
    if (req.user.role === "broker") {
      houses = await House.find({ broker: req.user._id });
    } else {
      houses = await House.find({ landlord: req.user._id });
    }
    res.status(200).json({ houses });
  } catch (error) {
    console.error("Error in getProperty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createProperty = async (req, res) => {
  try {
    let houseData = {
      city: req.body.city,
      subCity: req.body.subCity,
      wereda: req.body.wereda,
      comision: req.body.comision,
      specialLocation: req.body.specialLocation,
      type: req.body.type,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
    };

    if (req.user.role === "broker") {
      houseData.broker = req.params.id;

      if (!("landlord" in req.body)) {
        return res.status(400).json({ message: "You must link a landlord" });
      }
      houseData.landlord = req.body.landlord;
    } else {
      houseData.landlord = req.user._id;
    }

    const house = await House.create(houseData);

    res.status(201).json({
      message: "Property created successfully!",
      data: house,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating property" });
  }
};

exports.updateProperty = async (req, res) => {
  const { approvalStatus } = req.body;
  const updateObject = _.omit(req.body, approvalStatus);
  try {
    const houseToBeUpdated = await House.findById(req.params.id);

    if (!houseToBeUpdated) {
      return res.status(404).json({ error: "House not found" });
    }

    if (req.user.role === "broker") {
      if (houseToBeUpdated.broker.toString() !== req.user._id) {
        return res
          .status(401)
          .json({ error: "Unauthorized: You don't own this House" });
      }
    } else {
      if (houseToBeUpdated.landlord.toString() !== req.user._id) {
        return res
          .status(401)
          .json({ error: "Unauthorized: You don't own this House" });
      }
    }

    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      updateObject,
      { new: true }
    );

    if (!updatedHouse) {
      return res.status(500).json({ error: "Failed to update House" });
    }

    res.status(200).json({ updatedHouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteProperty = async (req, res) => {
  try {
    const houseToBeDeleted = await House.findById(req.params.id);

    if (!houseToBeDeleted) {
      return res.status(404).json({ error: "House not found" });
    }

    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      if (req.user.role === "broker") {
        if (houseToBeDeleted.broker.toString() !== req.user._id) {
          return res
            .status(401)
            .json({ error: "Unauthorized: You don't own this House" });
        }
      } else {
        if (houseToBeDeleted.landlord.toString() !== req.user._id) {
          return res
            .status(401)
            .json({ error: "Unauthorized: You don't own this House" });
        }
      }
    }

    const deleteResult = await House.deleteOne({ _id: req.params.id });

    if (deleteResult.deletedCount === 0) {
      return res.status(500).json({ error: "Failed to delete House" });
    }

    const deletedHouseData = {
      ...houseToBeDeleted._doc,
      deletionReason: req.body.deletionReason || "House deleted by user",
    };

    const newDeletedHouse = new deletedHouse(deletedHouseData);
    await newDeletedHouse.save();

    res.status(200).json({ message: "House deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.approvalStatusOfProperty = async (req, res) => {
  const { approvalStatus } = req.body;
  try {
    const houseToBeUpdated = await House.findById(req.params.id);

    if (!houseToBeUpdated) {
      return res.status(404).json({ error: "House not found" });
    }
    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      approvalStatus,
      { new: true }
    );

    if (!updatedHouse) {
      return res.status(500).json({ error: "Failed to update Status" });
    }

    res.status(200).json({ updatedHouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

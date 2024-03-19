const House = require("../model/houseModel");
const _ = require("lodash"); // Add this line to import lodash if you want to use it
const multer = require("multer");
const RentalRequest = require("../model/rentalRequestModel");

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this uploads directory exists
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// Initialize upload
const upload = multer({ storage: storage });

exports.uploadImages = upload.array("images", 5); // 'images' is the field name, 5 is the max number of files

exports.handleUploadImages = async (req, res) => {
  try {
    // req.files is the array of your files
    // You can now save the file information to your database, if needed
    res.status(200).json({
      message: "Images uploaded successfully!",
      files: req.files,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading images" });
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
    const houses = await House.find({ owner: req.user.id });
    res.status(200).json({ houses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createProperty = async (req, res) => {
  const {
    city,
    subCity,
    wereda,
    specialLocation,
    type,
    category,
    comision,
    price,
    description,
  } = req.body;
  const owner = req.user.id;

  try {
    const house = await House.create({
      owner,
      city,
      subCity,
      wereda,
      comision,
      specialLocation,
      type,
      category,
      price,
      description,
    });

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

    if (houseToBeUpdated.owner.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: You don't own this House" });
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

    if (houseToBeDeleted.owner.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: You don't own this House" });
    }

    const deleteResult = await House.deleteOne({ _id: req.params.id });

    if (deleteResult.deletedCount === 0) {
      return res.status(500).json({ error: "Failed to delete House" });
    }

    res.status(204).send();
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
      { approvalStatus },
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

exports.createRentalRequest = async (req, res) => {
  const { houseId, startDate, endDate } = req.body;
  const renterId = req.user.id; // Assuming you have the user's ID from the auth middleware

  try {
    // Check if the house exists
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    // Check if the house is available for the requested dates
    // This logic depends on how you track availability

    // Create the rental request
    const rentalRequest = await RentalRequest.create({
      house: houseId,
      renter: renterId,
      startDate,
      endDate,
    });

    res.status(201).json({ message: "Rental request created", rentalRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.manageRentalRequest = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body; // 'approved', 'rejected', or 'counter-offered'
  const landlordId = req.user.id; // Assuming you have the user's ID from the auth middleware

  try {
    const rentalRequest = await RentalRequest.findById(requestId).populate(
      "house"
    );
    if (!rentalRequest) {
      return res.status(404).json({ message: "Rental request not found" });
    }

    // Check if the user is the landlord of the house
    if (rentalRequest.house.owner.toString() !== landlordId) {
      return res
        .status(403)
        .json({ message: "Not authorized to manage this rental request" });
    }

    // Update the rental request status
    rentalRequest.status = status;
    await rentalRequest.save();

    res.status(200).json({ message: "Rental request updated", rentalRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.listRentalRequestsForLandlord = async (req, res) => {
  const landlordId = req.user.id; // Assuming you have the user's ID from the auth middleware

  try {
    // Find all houses owned by the landlord
    const houses = await House.find({ owner: landlordId });
    const houseIds = houses.map((house) => house._id);

    // Find all rental requests for the landlord's houses
    const rentalRequests = await RentalRequest.find({
      house: { $in: houseIds },
    }).populate("house renter");

    res.status(200).json({ rentalRequests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.markHouseUnavailable = async (req, res) => {
  const { startDate, endDate } = req.body;
  const houseId = req.params.id;
  const landlordId = req.user.id; // Assuming you have the user's ID from the auth middleware

  try {
    const house = await House.findById(houseId);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    if (house.owner.toString() !== landlordId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this house" });
    }

    // Add the new unavailable date range to the house
    house.unavailableDates.push({ start: startDate, end: endDate });
    await house.save();

    res.status(200).json({ message: "House marked as unavailable", house });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

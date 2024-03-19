const House = require("../model/houseModel");

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

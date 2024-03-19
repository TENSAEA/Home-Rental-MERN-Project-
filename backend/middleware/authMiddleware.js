const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const userAuth = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    req.user.id !== user.id &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  req.profile = user; // Add the user to the request object for use in the controller
  next();
};
const renterOnly = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user.role !== "renter") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

const adminsAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!(user.role === "admin" || user.role === "superadmin")) {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
const brockerAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user.role !== "broker") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
const landlordAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

const adminOrSuperAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user.role === "admin" || user.role === "superadmin") {
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

const landlordOrBrokerAuth = (req, res, next) => {
  if (["landlord", "broker"].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

module.exports = {
  renterOnly,
  adminsAuth,
  landlordAuth,
  brockerAuth,
  superAdminAuth,
  userAuth,
  adminOrSuperAdminAuth,
  landlordOrBrokerAuth,
};

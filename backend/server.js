// Load environment variables
require("dotenv").config();
const bodyParser = require("body-parser");

// Load dependencies
const express = require("express");
const cors = require("cors");

const app = express();

// Parse incoming request bodies
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Import routes
const userRoutes = require("./routes/userRoute");
const propertyRoutes = require("./routes/propertyRoute");
// const reportRoutes = require("./routes/reportRoute.js");
// const paymentRoutes = require("./routes/paymentRoute");
// const indexRoutes = require("./routes/indexRoute");
const pendingOrderRoutes = require("./routes/pendingOrderRoute.js");

// Use middleware
app.use(cors());

// Use routes
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/pending", pendingOrderRoutes);
// app.use("/reports", reportRoutes);
// app.use("/payments", paymentRoutes);
// app.use("/", indexRoutes);

const connectDb = require("./config/db");
connectDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

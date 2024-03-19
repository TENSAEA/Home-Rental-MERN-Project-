const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors"); // Import cors module

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
// const userRoutes = require("./routes/userRoute");
const propertyRoutes = require("./routes/propertyRoute");
// const reportRoutes = require("./routes/reportRoute.js");
// const paymentRoutes = require("./routes/paymentRoute");
// const indexRoutes = require("./routes/indexRoute");
const pendingOrderRoutes = require("./routes/pendingOrderRoute.js");

// Use cors
app.use(cors()); // Enable cors

// Use routes
// app.use("/users", userRoutes);
// app.use("/properties", propertyRoutes);
app.use("/pending", pendingOrderRoutes);
// app.use("/reports", reportRoutes);
// app.use("/payments", paymentRoutes);
// app.use("/", indexRoutes);

const connectDb = require("./config/db");
connectDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

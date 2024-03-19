// Load environment variables
require('dotenv').config();
const bodyParser = require('body-parser');
const crypto = require('crypto'); 
const http = require('http');
// Load dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
// Parse incoming request bodies
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

// Import routes
// const userRoutes = require("./routes/userRoute");
const propertyRoutes = require("./routes/propertyRoute");
// const reportRoutes = require("./routes/reportRoute.js");
// const paymentRoutes = require("./routes/paymentRoute");
// const indexRoutes = require("./routes/indexRoute");
const pendingOrderRoutes = require("./routes/pendingOrderRoute.js");
const userRoutes = require('./routes/usersRoute');


// Use middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(compression());
app.use(session({
    secret: sessionSecret,
    cookie: { secure: false, httpOnly: false },
    saveUninitialized: false,
    resave: false, 
}));

// Use routes
// app.use("/users", userRoutes);
// app.use("/properties", propertyRoutes);
app.use("/pending", pendingOrderRoutes);
app.use('/api/v1/users', userRoutes);
// app.use("/reports", reportRoutes);
// app.use("/payments", paymentRoutes);
// app.use("/", indexRoutes);

const connectDb = require("./config/db");
connectDb();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

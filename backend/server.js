const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Home Rental Mern Project, Team Two!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

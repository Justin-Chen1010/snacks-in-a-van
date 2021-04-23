const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require('./models')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const customerRouter = require('./routes/customerRouter');
const vendorRouter = require('./routes/vendorRouter');

app.use("/customer", customerRouter);
app.use("/vendor", vendorRouter);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Home page</h1>");
})

// Invalid path, return status 404
app.all("*", async (req, res) => {
    res.status(404).send("Not Found");
});

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

require('./models')

// TODO: readme file, db creds username/pw, input output expectations 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const customerRouter = require('./routes/customerRouter');
const vendorRouter = require('./routes/vendorRouter');


// app.use([customerRouter, vendorRouter]);
app.use("/customer", customerRouter);
app.use("/vendor", vendorRouter);

app.all("*", async (req, res) => {
    res.status(404).send("Not Found");
});

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});


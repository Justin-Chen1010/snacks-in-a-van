const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const {Snack} = require("./snack");
const app = express();

require('./models')

app.use(express.urlencoded({ extended: false }));

const customerRouter = require('./routes/customerRouter');
const vendorRouter = require('./routes/vendorRouter');


// app.use([customerRouter, vendorRouter]);
app.use("/customer", customerRouter);
app.use("/vendor", vendorRouter);

app.all("*", async (req, res) => {
    res.status(404).send("Not Found");
});


const port = 8080 // process.env.PORT || 8080

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});

// app.listen(process.env.PORT || 8080, () => {
//     console.log("The app is running!")
//     })


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();

// https://github.com/INFO30005-2021-SM1/project-t12-roboto
app.use(express.urlencoded({ extended: false }));

// Handles request for menu page
app.get("/customer/menu", (req, res) => {
    res.send(`Menu Page`);
});

// Cannot GET /customer/menu/hcocs
// Handles request for single food item
app.get("/customer/menu/:food", (req, res) => {
  res.send(`<h1>${req.params.food}</h1>`);
});

app.post("/customer/order", (req, res) => {
    res.send(`<h1>start new order</h1>`);
});

const port = 8080 // process.env.PORT || 8080

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});


// TODO: During tutorial  is it "orders: [orderSchema] or orders: {type: orderSchema}"
const snackSchema = mongoose.Schema({
    itemID: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    price: {type: Number, min: 0, required: true},
    imageURL: {type: String, required: true}
});

const singleItemOrderSchema = mongoose.Schema({
    snack: {type: snackSchema, required: true},
    amount: {type: Number, required: true, min: 1}
});

const ratingSchema = mongoose.Schema({
    score: {type: Number, min: 0, max: 5},
    comment: {type: String}
});

// need a "[server-name]/vendor" and a "[server-name]/customer"
// vendor
const vendorSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    open: {type: Boolean, required: true},
    lat: {type: Number},
    long: {type: Number}
});

// TODO: Check during tutorial if we need timeFulfilled, timePickedUp or just discount Applied
// TODO: how to initialise two schemas that reference each other (?)
const orderSchema = mongoose.Schema({
    orderID: {type: String, required: true, unique: true},
    timeOrdered: {type: Date, default: Date.now},
    timeFulfilled: {type: Date},
    timePickedUp: {type: Date},
    status: {type: String, enum: ['preparing', 'fulfilled', 'completed', 'cancelled'], required: true},
    discountApplied: {type: Boolean},
    // customer: customerSchema,
    vendor: vendorSchema,
    items: [singleItemOrderSchema],
    customerRating: ratingSchema
});

// double check if need to put "unique: false"
const customerSchema = mongoose.Schema({ 
    email: {type: String, required: true, unique: true},
    familyName: {type: String, required: true},
    givenName: {type: String, required: true},
    password: {type: String, required: true},
    orders: [orderSchema]
});

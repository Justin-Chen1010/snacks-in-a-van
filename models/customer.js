const mongoose = require("mongoose");
// const bcrypt = require("bcrypt-nodejs");

// double check if need to put "unique: false"
const customerSchema = new mongoose.Schema({ 
    customerId: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    familyName: {type: String, required: true},
    givenName: {type: String, required: true},
    password: {type: String, required: true},
    orders: [{type: String}]
});

// customerSchema 

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;

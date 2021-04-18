const mongoose = require("mongoose");


// double check if need to put "unique: false"
const customerSchema = new mongoose.Schema({ 
    customerId: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    familyName: {type: String, required: true},
    givenName: {type: String, required: true},
    password: {type: String, required: true},
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: "Order"}]
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;

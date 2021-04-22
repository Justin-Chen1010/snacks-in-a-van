const mongoose = require("mongoose");
const {Rating} = require("./rating");
const {itemOrder} = require("./itemOrder");

const orderSchema = new mongoose.Schema({
    orderId: {type: String, required: true, unique: true},
    
    timeOrdered: {type: Date, default: Date.now},
    timeFulfilled: {type: Date},
    timePickedUp: {type: Date},
    status: {type: String, enum: ['preparing', 'fulfilled', 'completed', 'cancelled'], required: true, default:"preparing"},
    discountApplied: {type: Boolean, default: false},
    // customer: customerSchema,
    vendor: {type: String, required: true},
    // Array of object IDs
    // [{snack: snackId, quantity: 3}, {snack: snackId, quantity: 3}]
    items: [
        {
            snack: {type: String, required: true},
            quantity: {type: Number, required: true,min: 1}
        }
    ],
    // items: [{type: mongoose.Schema.Types.ObjectId, ref:"ItemOrder"}],
    customerRating: {type: mongoose.Schema.Types.ObjectId, ref: "Rating"},
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

const mongoose = require("mongoose");
const {Rating} = require("./rating");

const orderSchema = new mongoose.Schema({
    orderId: {type: String, required: true, unique: true},
    timeOrdered: {type: Date, default: Date.now},
    timeFulfilled: {type: Date},
    timePickedUp: {type: Date},
    status: {type: String, enum: ['preparing', 'fulfilled', 'completed', 'cancelled'], required: true},
    discountApplied: {type: Boolean, default: false},
    // customer: customerSchema,
    vendor: {type: mongoose.Schema.Types.ObjectId, ref: "Vendor"},
    items: [itemOrder],
    customerRating: {type: mongoose.Schema.Types.ObjectId, ref: "Rating"}
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

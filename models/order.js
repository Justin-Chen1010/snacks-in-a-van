const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },

  timeOrdered: { type: mongoose.Date, default: Date.now },
  timeFulfilled: { type: mongoose.Date, default : null },
  timePickedUp: { type: mongoose.Date , default: null},
  status: {
    type: String,
    enum: ["preparing", "fulfilled", "completed", "cancelled"],
    required: true,
    default: "preparing",
  },
  discountApplied: { type: Boolean, default: false },
  vendor: { type: String, required: true },
  // Array of object IDs
  items: [
    {
      snack: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  score: { type: Number, default: null },
  comment: { type: String , default: null},

});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

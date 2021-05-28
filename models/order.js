const mongoose = require("mongoose");
const { Rating } = require("./rating");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },

  timeOrdered: { type: Date, default: Date.now },
  timeFulfilled: { type: Date,default: null },
  timePickedUp: { type: Date,default: null },
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
  customerRating: { type: mongoose.Schema.Types.ObjectId, ref: "Rating" },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

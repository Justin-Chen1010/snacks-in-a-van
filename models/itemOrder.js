const mongoose = require("mongoose");

const itemOrderSchema = new mongoose.Schema({
    snack: {type: snackSchema, required: true},
    amount: {type: Number, required: true, min: 1}
});

const ItemOrder = mongoose.model("ItemOrder", itemOrderSchema);

module.exports = ItemOrder;
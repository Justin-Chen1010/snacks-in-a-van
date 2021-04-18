const mongoose = require("mongoose");
const {Snack} = require("./snack"); 

const itemOrderSchema = new mongoose.Schema({
    snack: {type: mongoose.Schema.Types.ObjectId, ref:"Snack"},
    amount: {type: Number, required: true, min: 1}
});

const ItemOrder = mongoose.model("ItemOrder", itemOrderSchema);

module.exports = ItemOrder;
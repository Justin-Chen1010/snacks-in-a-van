const mongoose = require("mongoose");

const snackSchema = new mongoose.Schema({
    snackId: {type: String, required: true, unique: true},
    snackName: {type: String, required: true},
    price: {type: Number, min: 0, required: true},
    imageURL: {type: String, required: true}
});

const Snack = mongoose.model("Snack", snackSchema);
module.exports = Snack;

const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    score: {type: Number, min: 0, max: 5},
    comment: {type: String}
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;

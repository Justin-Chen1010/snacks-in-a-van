const mongoose = require("mongoose");

// need a "[server-name]/vendor" and a "[server-name]/customer"
// vendor
const vendorSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    open: {type: Boolean, required: true},
    lat: {type: Number},
    long: {type: Number}
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;

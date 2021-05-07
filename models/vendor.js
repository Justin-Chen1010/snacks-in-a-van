const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  open: { type: Boolean, required: true },
  lat: { type: Number },
  lon: { type: Number },
  address: { type: String },
});

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;

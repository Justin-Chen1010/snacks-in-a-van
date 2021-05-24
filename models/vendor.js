const mongoose = require("mongoose");

const bcrypt   = require('bcrypt')

const vendorSchema = new mongoose.Schema({
  vendorName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  open: { type: Boolean, required: true },
  lat: { type: Number },
  lon: { type: Number },
  address: { type: String },
  role:{ type: String, default: "vendor"},
  vendorEmail:{ type: String}

});

vendorSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
vendorSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;

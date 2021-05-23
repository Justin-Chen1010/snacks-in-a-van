const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

// double check if need to put "unique: false"
const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  familyName: { type: String, required: true },
  givenName: { type: String, required: true },
  password: { type: String, required: true },
  orders: [{ type: String }],
  role : {type: String, default: "customer"}
});

// customerSchema
customerSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
customerSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;

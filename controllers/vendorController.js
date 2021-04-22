const mongoose = require("mongoose");

// import vendor model
const Vendor = mongoose.model("Vendor");
const Order = mongoose.model("Order");

// get all vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    return res.send(vendors);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// find one vendor by their id
const getOneVendor = async (req, res) => {
  try {
    const oneVendor = await Vendor.findOne({
      vendorId: req.params.vendorId,
    });
    if (oneVendor === null) {
      // no vendor found in database
      res.status(404);
      return res.send("Vendor not found");
    }
    return res.send(oneVendor); // vendor was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// change an vendor (POST)
const updateVendor = async (req, res) => {
  try {
    const oneVendor = await Vendor.findOne({
      vendorId: req.params.vendorId,
    });
    if (oneVendor === null) {
      // no vendor found in database
      res.status(404);
      return res.send("Vendor not found");
    }
    // actually update the vendor
    Vendor.updateOne({ vendorId: oneVendor.vendorId });
    // db.foods.updateOne( {name: "Apple"}, {$set: {description: "Apples are cool" }}
    return res.send(oneVendor); // vendor was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// add an vendor (POST)
const addVendor = async (req, res) => {
  // try {
  Vendor.create(
    {
      name: "actUallyAdMiN",
      password: "a@dmin.actually.com",
      open: false,
      lat: 0,
      long: 0,
    },
    (err, vendor) => {
      if (err) {
        res.status(400);
        return res.send("Database query failed");
      } else {
        return res.send(vendor);
      }
    }
  );
};

const getOutstandingOrders = async (req, res) => {
    try {
        const vendor = await Vendor.find({name: req.params.vendorName});
        console.log(vendor);
        const outstanding = await Order.findAll({vendor: vendor, status: "preparing"});
        console.log(outstanding);
        res.send(outstanding);
    } catch (err) {
        res.status(400);
        return res.send("Database query failed")
    }
}

const updateVanStatus = async(req, res) => {
    try {
        const oneVendor = await Vendor.findOne({
            vendorId: req.params.vendorId,
        });
        if (oneVendor === null) {
            // no vendor found in database
            res.status(404);
            return res.send("Vendor not found");
        }
        if (!oneVendor.open) {
            await Vendor.updateOne({ vendorId: oneVendor.vendorId }, {$set:{open: true}});
        }
        else {
            await Vendor.updateOne({ vendorId: oneVendor.vendorId }, {$set: {open: false}});
        }
        res.send("Done Boi");

    } catch (err) {
        res.status(400);
        return res.send("Database query failed");
    }
}

// remember to export the functions
module.exports = {
  getAllVendors,
  getOneVendor,
  updateVendor,
  addVendor,
  getOutstandingOrders,
  updateVanStatus,
};
const mongoose = require("mongoose");
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
    const vendor = await Vendor.findOne({ vendorName: req.params.vendorName });
    const outstanding = await Order.find({
      vendor: vendor.vendorName,
      status: "preparing",
    });
    res.send(outstanding);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};


const updateVanStatus = async (req, res) => {
  try {
    const oneVendor = await Vendor.findOne({
      vendorName: req.params.vendorName,
    });
    const status = req.body;

    if (oneVendor === null) {
      // no vendor found in database
      res.status(404);
      return res.send("Vendor not found");
    }
    if (!oneVendor.open) {
      await Vendor.updateOne(
        { vendorName: oneVendor.vendorName },
        {
          $set: {
            open: status.open,
            lat: status.lat,
            lon: status.lon,
            address: status.address,
          },
        }
      );
    } else {
      await Vendor.updateOne(
        { vendorName: oneVendor.vendorName },
        {
          $set: {
            open: status.open,
            lat: null,
            lon: null,
            address: null,
          },
        }
      );
    }
    res.send(status);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};


// PUT vendor/:vendorName/orders/:orderId/fulfill
const markOrderAsFulfilled = async (req, res) => {
  const filter = {
    orderId: req.params.orderId,
    status: "preparing",
    vendor: req.params.vendorName,
  };
  await Order.findOneAndUpdate(filter, { $set: { status: "fulfilled" } });
  const order = Order.findOne(filter);
  if (order === null) {
    res.status(404);
    return res.send("Order not found");
  }


  res.send();
};


module.exports = {
  getAllVendors,
  getOneVendor,
  updateVendor,
  addVendor,
  getOutstandingOrders,
  updateVanStatus,
  markOrderAsFulfilled,
};

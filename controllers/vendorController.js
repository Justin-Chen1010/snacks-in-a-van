const mongoose = require("mongoose");
const Vendor = mongoose.model("Vendor");
const Order = mongoose.model("Order");
const { v4: uuidv4 } = require("uuid");

// get all vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ open: true })
      .select({ password: 0 })
      .lean();
    res.render("vendorList", { vendors: vendors ,layout :'main.hbs'

    });
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

const getAllopwnVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ open: true })
      .select({ password: 0 })
      .lean();
    res.render("vendorList", { vendors: vendors ,layout :'main.hbs'

    });
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// find one vendor by their id
const getOneVendor = async (req, res) => {
  try {
    const oneVendor = await Vendor.findOne({
      vendorName: req.session.vendorName,
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
      vendorName: req.session.vendorName,
    });
    if (oneVendor === null) {
      // no vendor found in database
      res.status(404);
      return res.send("Vendor not found");
    }
    // actually update the vendor
    Vendor.updateOne({ vendorName: oneVendor.vendorName });
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
  const vendor = req.body;
  Vendor.create(
    {
      vendorName: vendor.vendorName,
      password: vendor.password,
      open: false, //default to close
    },
    (err, vendor) => {
      if (err) {
        console.log(err);
        res.status(400);
        return res.send("Database query failed");
      } else {
        return res.send(vendor);
      }
    }
  );
};

// get all orders for a specific vendor that have status "preparing"
const getOutstandingOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ vendorName: req.session.vendorName });
    // Get unfulfilled orders and sort them by time ordered, earlier ones first
    const outstanding = await Order.find({
      vendor: vendor.vendorName,
      status: "preparing",
    }).sort("timeOrdered");
    res.send(outstanding);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// Mark van status as open with lat, lon, and address, or close
const updateVanStatus = async (req, res) => {
  try {
    const oneVendor = await Vendor.findOne({
      vendorName: req.session.vendorName,
    });
    const status = req.body;

    if (oneVendor === null) {
      // no vendor found in database
      res.status(404);
      return res.send("Vendor not found");
    }
    // If vendor was closed, change to open and update address
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
      //If it was open, close the store and set location to NULL
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

// mark an order as "fulfilled"
const markOrderAsFulfilled = async (req, res) => {
  // find only the 'preparing' status
  try {
    const filter = {
      orderId: req.params.orderId,
      status: "preparing",
      vendor: req.session.vendorName,
    };

    const order = await Order.findOne(filter);
    if (order === null) {
      // no order that has status "preparing" with that id and for that vendor
      res.status(404);
      return res.send("Order not found :^(");
    }
    await Order.updateOne(filter, {
      $set: { status: "fulfilled", timeFulfilled: Date.now() },
      //Set default date and time to the time fulfilled
    });
    res.send("Order status updated!");
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// remember to export the functions
module.exports = {
  getAllVendors,
  getOneVendor,
  updateVendor,
  addVendor,
  getOutstandingOrders,
  updateVanStatus,
  markOrderAsFulfilled,
};

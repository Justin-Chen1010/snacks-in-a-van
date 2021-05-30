const mongoose = require("mongoose");
const Snack = require("../models/snack");
const Order = require("../models/order");

// get all snacks
const getAllSnacks = async (req, res) => {
  try {
    const snacks = await Snack.find().lean();
    const currOrder = await Order.findOne({
      orderId: req.query.orderId,
    }).lean();
    res.render("menu", { menu: snacks, order: currOrder });
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// attach info about all the snack in this request
const getMenu = async (req, res, next) => {
  const snacks = await Snack.find().lean();
  req.menu = snacks;
  next();
};

// find one snack by their id
const getOneSnack = async (req, res) => {
  try {
    const oneSnack = await Snack.findOne({ snackId: req.params.snackId });
    if (oneSnack === null) {
      // no snack found in database
      res.status(404);
      return res.send("Snack not found");
    }

    res.send(oneSnack); // snack was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

module.exports = {
  getMenu,
  getAllSnacks,
  getOneSnack,
};

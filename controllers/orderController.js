const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const Customer = mongoose.model("Customer");

// import order model
const Order = mongoose.model("Order");

// get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.send(orders);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// find one order by their id
const getOneOrder = async (req, res) => {
  try {
    const oneOrder = await Order.findOne({ orderId: req.params.orderId });
    if (oneOrder === null) {
      // no order found in database
      res.status(404);
      return res.send("Order not found");
    }
    return res.send(oneOrder); // order was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// add order
const addOrder = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      customerId: req.params.customerId,
    });
    if (customer === null) {
      // no customer found in database
      res.status(404);
      return res.send("Customer not found");
    }
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }

  // let order = Order.insertOne({orderId: uuidv4(), status: :"preparing", })
};

// make new order is POST: customer/:customerId/newOrder

// change an order (POST)
const updateOrder = async (req, res) => {
  try {
    const oneOrder = await Order.findOne({ orderId: req.params.orderId });
    if (oneOrder === null) {
      // no order found in database
      res.status(404);
      return res.send("Order not found");
    }
    // actually update the order
    Order.updateOne({ orderId: oneOrder.orderId });
    // db.foods.updateOne( {name: "Apple"}, {$set: {description: "Apples are cool" }}
    return res.send(oneOrder); // order was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// remember to export the functions
module.exports = {
  getAllOrders,
  getOneOrder, //, updateOrder, addOrder
};


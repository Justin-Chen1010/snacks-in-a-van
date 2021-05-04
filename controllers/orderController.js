const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Vendor = require("../models/vendor");
const Customer = mongoose.model("Customer");
const Order = mongoose.model("Order");
const Snack = mongoose.model("Snack");

// get all orders
const getAllOrders = async (req, res) => {
  try {
    // sort by timeOrdered, earlier orders first
    const orders = await Order.find().sort('timeOrdered').lean();
    // return res.send(orders);
    return res.render('orders', {'orders':orders, 'isLoggedin':req.isAuthenticated()});
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
    // order was found
    return res.send(oneOrder); 
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

    // HTTP POST method, req.body = [{name: snack_name, quantity: quantity, vendorName: vendorName}]
    const order = req.body;

    // find the food by name
    const snack = await Snack.findOne({ snackName: order.snackName });
    // Snack not found, send message
    if (snack === null) {
      return res.status(400).send(`Food item ${order.snackName} not found....`);
    }
    // get the food item Id
    let snackId = snack.snackId;

    const vendor = await Vendor.findOne({vendorName: order.vendorName});
    if (vendor === null || !vendor.open) {
      return res.status(400).send(`No open vendor named ${order.vendorName} found...`);
    }
    // To order items with specific quantity
    let newOrder = await Order.create({
      orderId: uuidv4(),
      vendor: order.vendorName,
      items: [{ snack: snackId, quantity: order.quantity }],
    });

    // get the id field of newly inserted order 
    const id = newOrder.orderId;

    await Customer.updateOne(
      { customerId: req.params.customerId },
      { $push: { orders: id } }
    );

    res.send(newOrder);
  } catch (err) {
    // error occurred
    res.status(400);
    console.log(err);
    return res.send("Database query failed");
  }
};

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

    // order was found: return as repsonse
    return res.send(oneOrder); 
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

module.exports = {
  getAllOrders,
  getOneOrder,
  addOrder,
  updateOrder
};

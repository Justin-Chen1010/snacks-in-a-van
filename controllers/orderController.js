const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const Customer = mongoose.model("Customer");

// import order model
const Order = mongoose.model("Order");
const Snack = mongoose.model("Snack");
const ItemOrder = mongoose.model("ItemOrder");

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

  // get the query string www.hostname.com/customer/:customerId/order/?name=white+coffee&amount=3
  const {name, amount} = req.query;
  // find the food item Id
  const snack = await Snack.findOne({name: name});
  console.log(snack);
  if (!snack){
    return res.status(400).send(`Food item ${name} not found....`);
  }
  let snackId = snack._id;

  // Create a single item order ID
  const itemOrder = await ItemOrder.create({snack: snackId, amount: Number(amount)});

  let order = await Order.create({orderId: uuidv4(), status: "preparing", items:[itemOrder._id]});
  // get the _id field of newly inserted order
  const id = order._id;

  await Customer.updateOne({customerId: req.params.customerId}, { $push: {orders: id}});

  res.send("IM DONE NOW");

  } catch (err) {
    // error occurred
    res.status(400);
    console.log(err);
    return res.send("Database query failed");
  }
};

// make new order is POST: customer/:customerId/order/

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
  getOneOrder, 
  addOrder,
  updateOrder
  //, updateOrder, addOrder
};


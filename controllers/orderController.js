const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Vendor = require("../models/vendor");
const Customer = require("../models/customer");
const Order = require("../models/order");
const Snack = require("../models/snack");

// get all orders
const getAllOrders = async (req, res) => {
  try {
    // sort by timeOrdered, earlier orders first
    const orders = await Order.find().sort("timeOrdered").lean();
    return res.render("orders", {
      orders: orders
    });
  } catch (err) {
    return res.render("error", {
      errorCode: 404,
      message: "Database query failed",
      backTo: "/customer",
    });
  }
};


// get all orders for a specific vendor that have status "preparing"
const getOrdersForVendor = async (req, res) => {
  try {
    // default status is "preparing"
    const orderStatus = req.query.status ? req.query.status : "preparing";
    const vendor = await Vendor.findOne({ vendorName: req.session.vendorName });
    // Get unfulfilled orders and sort them by time ordered, earlier ones first
    const orders = await Order.find({
      vendor: vendor.vendorName,
      status: orderStatus,
    }).sort("timeOrdered").lean();
    res.render("vendor/orders", {orders: orders, status: orderStatus, layout:"vendormain.hbs"});
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
}

const getOrderingCustomer = async (req, res, next) => {
  try {
    // find the customer who has the same order id in his/her array of order ids
    const oneCustomer = await Customer.findOne({orders: req.params.orderId}).lean();
    req.customer = oneCustomer;
  } catch (err) {
    res.status(400).send("Database query failed");
  } finally {
    next();
  }
}


// find one order by their id
const getOneOrder = async (req, res) => {
  try {
    const oneOrder = await Order.findOne({
      orderId: req.params.orderId,
    }).lean();
    const vendor = await Vendor.findOne({
      vendorName: oneOrder.vendor
    }).lean();
    if (oneOrder === null) {
      // no order found in database
      res.status(404);
      return res.render("error", {
        errorCode: 404,
        message: `Order ${req.params.orderId} not found.`,
        backTo: "/customer",
      });
    }
    if (vendor === null) {
      // no vendor found in database
      res.status(404);
      return res.render("error", {
        errorCode: 404,
        message: `Vendor ${oneOrder.vendor} not found.`,
        backTo: "/customer",
      });
    }
    // order was found
    res.render("order", {
      order: oneOrder,
      vendor: vendor,
      menu: req.menu,
      discountSettings: {
        discountTimeLimitMin: req.app.settings.config.discountTimeLimitMin,
        orderLockInTimeLimitMin: req.app.settings.config.orderLockInTimeLimitMin,
        discountRate: req.app.settings.config.discountRate
      }
    });
  } catch (err) {
    console.log(err);
    // error occurred
    res.status(400);
    return res.render("error", {
      errorCode: 400,
      message: "Database query failed",
      backTo: "/customer",
    });
  }
};

// find one order by their id
const getOneOrderForVendor = async (req, res) => {
  try {
    const oneOrder = await Order.findOne({
      orderId: req.params.orderId,
    }).lean();

    if (oneOrder === null) {
      // no order found in database
      res.status(404);
      return res.render("error", {
        errorCode: 404,
        message: `Order ${req.params.orderId} not found.`,
        backTo: "/vendor",
      });
    }
    // order was found
    res.render("vendor/order", 
      {
        order: oneOrder,
        menu: req.menu,
        customer: req.customer, 
        layout: "vendormain.hbs",
        discountSettings: {
          discountTimeLimitMin: req.app.settings.config.discountTimeLimitMin,
          orderLockInTimeLimitMin: req.app.settings.config.orderLockInTimeLimitMin,
          discountRate: req.app.settings.config.discountRate
        }
      }
    );
  } catch (err) {
    console.log(err);   
    // error occurred
    res.status(400);
    return res.render("error", {
      errorCode: 400,
      message: "Database query failed",
      backTo: "/vendor",
    });
  }
};

const getOrderByIdPattern = async (req, res) => {
  try {
    // Find all orders that match the given regex
    const orderStatus = req.query.status ? req.query.status : "preparing";
    const vendor = await Vendor.findOne({ vendorName: req.session.vendorName });
    const orderIdPattern = req.body.orderIdSearch;
    var matchedOrders;
    if (orderIdPattern !== null){
        matchedOrders = await Order.find(
          { 
            orderId: { $regex: new RegExp("^" + orderIdPattern, "i")},
            vendor: vendor.vendorName,
            status: orderStatus
          }).sort("timeOrdered").lean();
    } else {
      matchedOrders = await Order.find({});
    }
    res.render("vendor/orders", {orders: matchedOrders, status: orderStatus, layout:"vendormain.hbs"});

  } catch (err) {
    console.log(err);   
    // error occurred
    res.status(400);
    return res.render("error", {
      errorCode: 400,
      message: "Database query failed",
      backTo: "/vendor/order",
    });
  }
}

//get the rating for each order
const getRating = async (req, res) => {
  try {
    const oneOrder = await Order.findOne({
      orderId: req.params.orderId,
    }).lean();
    if (oneOrder === null) {
      // no order found in database
      res.status(404);
      return res.render("error", {
        errorCode: 404,
        message: `Order ${req.params.orderId} not found.`,
        backTo: "/customer",
      });
    }
    // order was found
    res.render("rating", {
      order: oneOrder,
    });
  } catch (err) {
    console.log(err);
    // error occurred
    res.status(400);
    return res.render("error", {
      errorCode: 400,
      message: "Database query failed",
      backTo: "/customer",
    });
  }
}

// add order
const addOrder = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      customerId: req.session.userId,
    });

    // HTTP POST method, req.body = [{name: snack_name, quantity: quantity, vendorName: vendorName}]
    const order = req.body;

    // find the food by name
    const snack = await Snack.findOne({ snackId: order.snackId });
    // Snack not found, send message
    if (snack === null) {
      return res.status(400).send(`Food item ${order.snackId} not found....`);
    }
    // get the food item Id
    let snackId = snack.snackId;

    const vendor = await Vendor.findOne({ vendorName: order.vendorName });
    if (vendor === null || !vendor.open) {
      return res
        .status(400)
        .send(`No open vendor named ${order.vendorName} found...`);
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
      { customerId: req.session.userId },
      { $push: { orders: id } }
    );
    return res.send(newOrder);
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
    const newOrder = req.body;
    const oneOrder = await Order.findOne({ orderId: req.params.orderId });
    if (oneOrder === null) {
      // no order found in database
      res.status(404);
      return res.send("Order not found");
    }
    // update the order's status and items in that order
    oneOrder.status = newOrder.status;
    oneOrder.timeOrdered = newOrder.timeOrdered;
    oneOrder.timeFulfilled = newOrder.timeFulfilled;
    oneOrder.timePickedUp = newOrder.timePickedUp;
    oneOrder.discountApplied = newOrder.discountApplied;
    oneOrder.comment = newOrder.comment;
    oneOrder.score = newOrder.score;
    oneOrder.items = newOrder.items.map((item) => ({
      _id: mongoose.Types.ObjectId(),
      snack: item.snackId,
      quantity: item.quantity,
    }));
    let result = await oneOrder.save();
    return res.send(result);
  } catch (err) {
    // error occurred
    console.log(err);
    res.status(400);
    return res.send("Database query failed");
  }
};

// find all orders for specific customer
const getOrdersForCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      customerId: req.session.userId,
    });

    const orders = await Promise.all(
      customer.orders.map(async (id) => {
        var order = await Order.findOne({ orderId: id}).lean();
        return order;
      })
    );
    orders.reverse();

    if (customer === null) {
      // no customer found in database: 404
      res.status(404);
      return res.render("error", {
        errorCode: 404,
        message: "Database query failed",
        backTo: "/customer",
      });
    }
    // customer was found, return as response
    return res.render("orders", {
      orders: orders
    });
  } catch (err) {
    // error occurred
    res.status(400);
    return res.render("error", {
      errorCode: 400,
      message: "Database query failed",
      backTo: "/customer",
    });
  }
};



module.exports = {
  getAllOrders,
  getOneOrder,
  addOrder,
  updateOrder,
  getRating,
  getOrdersForVendor,
  getOneOrderForVendor,
  getOrderByIdPattern,
  getOrderingCustomer,
  getOrdersForCustomer
};

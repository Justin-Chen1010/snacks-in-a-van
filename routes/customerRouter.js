const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customerController");
const snackController = require("../controllers/snackController");
const orderController = require("../controllers/orderController");

// get the menu: details of all snacks
customerRouter.get("/menu", async (req, res) =>
  snackController.getAllSnacks(req, res)
);

// get the details of a single snack
customerRouter.get("/menu/:snackId", async (req, res) => {
  snackController.getOneSnack(req, res);
});

// insert an order, specifying the name of the first snack and the assigned
// vendor
customerRouter.post("/:customerId/order", async (req, res) =>
  orderController.addOrder(req, res)
);

// insert new customer
customerRouter.post("/", async (req, res) =>
  customerController.addCustomer(req, res)
);

// export the router
module.exports = customerRouter;

const express = require("express");

const customerRouter = express.Router();

const customerController = require("../controllers/customerController");
const snackController = require("../controllers/snackController");
const orderController = require("../controllers/orderController");

// Handles request for menu page
customerRouter.get("/menu", (req, res) => snackController.getAllSnacks(req, res));

// Cannot GET /customer/menu/hcocs
// Handles request for single food item (Doesn't actually pull anything yet)
customerRouter.get("/menu/:snackId", (req, res) => {
  snackController.getOneSnack(req, res);
});

// insert new order 
customerRouter.post("/:customerId/order", async (req, res) =>
  orderController.addOrder(req, res)
);

//insert new customer
customerRouter.post("/", async (req, res) =>
  customerController.addCustomer(req, res)
);

// export the router
module.exports = customerRouter;
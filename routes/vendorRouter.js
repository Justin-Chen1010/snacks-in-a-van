const express = require("express");

const vendorRouter = express.Router()

const customerController = require("../controllers/customerController");
const snackController = require("../controllers/snackController");
const vendorController = require("../controllers/vendorController");

// get outstanding orders
vendorRouter.get("/:vendorName/order", (req, res) => vendorController.getOutstandingOrders(req, res));

vendorRouter.get("/", (req, res) => vendorController.getAllVendors(req, res));

// mark item as fulfilled
vendorRouter.put("/:vendorName/order/:orderId", (req, res) =>"");

// set van status
vendorRouter.put("/:vendorName/changeStatus", (req, res) => vendorController.updateVanStatus(req, res));

// create new vendor
// vendorRouter.post("/", (req, res) => addVendor(req, res));

// TODO: delete this later, YES Poggérs
vendorRouter.post("/actuallyadmin/order/", (req, res) => snackController.addSnack(req, res));

module.exports = vendorRouter;

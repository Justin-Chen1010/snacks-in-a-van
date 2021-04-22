const express = require("express");
const vendorRouter = express.Router()
const snackController = require("../controllers/snackController");
const vendorController = require("../controllers/vendorController");

// get all vendors
vendorRouter.get("/", (req, res) => vendorController.getAllVendors(req, res));

// get outstanding orders for a vendor
vendorRouter.get("/:vendorName/order", (req, res) => vendorController.getOutstandingOrders(req, res));

// mark item as fulfilled
vendorRouter.put("/:vendorName/order/:orderId/status", (req, res) => vendorController.markOrderAsFulfilled(req, res));

// set van status
vendorRouter.put("/:vendorName/status", (req, res) => vendorController.updateVanStatus(req, res));

// create new vendor
vendorRouter.post("/", (req, res) => vendorController.addVendor(req, res));

// TODO: delete this later, YES Poggérs
vendorRouter.post("/actuallyadmin/order/", (req, res) => snackController.addSnack(req, res));

module.exports = vendorRouter;

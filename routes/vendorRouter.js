const express = require("express");

const vendorRouter = express.Router()

const customerController = require("../controllers/customerController");
const snackController = require("../controllers/snackController");
const { addVendor } = require("../controllers/vendorController");

// get outstanding orders
vendorRouter.get("/:vendorId/order", (req, res) => "");

// mark item as fulfilled
vendorRouter.put("/:vendorId/order/:orderId", (req, res) => "");

// create new vendor
vendorRouter.post("/", (req, res) => addVendor(req, res));

// TODO: delete this later, YES Poggérs
vendorRouter.post("/actuallyadmin/order/", (req, res) => snackController.addSnack(req, res));

module.exports = vendorRouter;

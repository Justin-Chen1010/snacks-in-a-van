const express = require("express");

const customerRouter = express.Router()

const customerController = require("../controllers/customerController");
const snackController = require("../controllers/snackController");

// Handles request for menu page
app.get("/customer/menu", async (req, res) => {
    res.send(`<h1>Menu</h1>`);
});

// Cannot GET /customer/menu/hcocs
// Handles request for single food item (Doesn't actually pull anything yet)
app.get("/customer/menu/:food", async (req, res) => {
  res.send(`<h1>${req.params.food}</h1>`);
});

app.post("/customer/order", async (req, res) => {
    res.send(`<h1>start new order</h1>`);
});
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// https://github.com/INFO30005-2021-SM1/project-t12-roboto
app.use(express.urlencoded({ extended: false }));
// TODO: dont forget to include image
ITEMS = [
    {
        name: "Cappuccino",
        price: 3.8
    },
    {
        name: "Latte",
        price: 4.5
    },
    {
        name: "Flat white",
        price: 4.8
    },
    {
        name: "Long black",
        price: 4.5
    },
    {
        name: "Plain biscuit",
        price: 4.5
    },
    {
        name: "Small cake",
        price: 7
    },
    {
        name: "Big cake",
        price: 15.9
    },
];

// Handles request for menu page
app.get("/customer/menu", (req, res) => {
    res.send(`Menu Page`);
});

// Cannot GET /customer/menu/hcocs
// Handles request for single food item
app.get("/customer/menu/:food", (req, res) => {
  res.send(`<h1>${req.params.food}</h1>`);
});

app.post("/customer/order", (req, res) => {
    res.send(`<h1>start new order</h1>`);
});

app.listen(8080, () => {
  console.log("The app is listening on port 8080!");
});

// need a "[server-name]/vendor" and a "[server-name]/customer"
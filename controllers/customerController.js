const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Customer = require("../models/customer");

// get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().lean();
    return res.send(customers);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// find one customer by their id
const getOneCustomer = async (req, res) => {
  try {
    const oneCustomer = await Customer.findOne({
      customerId: req.session.userId,
    });
    if (oneCustomer === null) {
      // no customer found in database: 404
      res.status(404);
      return res.send("Customer not found");
    }
    // customer was found, return as response
    return res.send(oneCustomer);
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// add a customer, given their email, family name, given name and password
const addCustomer = async (req, res) => {
  const customer = req.body;
  Customer.create(
    {
      customerId: uuidv4(),
      email: customer.email,
      familyName: customer.familyName,
      givenName: customer.givenName,
      password: customer.password,
      orders: [],
    },
    (err, customer) => {
      if (err) {
        res.status(400);
        return res.send("Database query failed");
      } else {
        return res.send(customer);
      }
    }
  );
};

// update a customer's details
const updateCustomer = async (req, res) => {
  try {
    let oneCustomer = await Customer.findOne({
      email: req.session.email,
    });
    if (oneCustomer === null) {
      // no customer found in database
      res.status(404);
      return res.send("Customer not found");
    }
    const newDetails = req.body;
    // update the customer
    var currentCustomer = new Customer();
    currentCustomer.customerId = oneCustomer.customerId;
    currentCustomer.email = newDetails.email;
    currentCustomer.familyName = req.body.familyName;
    currentCustomer.givenName = req.body.givenName;
    currentCustomer.role="customer";
    currentCustomer.password = currentCustomer.generateHash(req.body.password);

    await Customer.updateOne(
      { email: oneCustomer.email },
      {
        $set: {
          familyName: currentCustomer.familyName,
          givenName: currentCustomer.givenName,
          password: currentCustomer.password
        }
      }
    );
    return res.render("account", {email: req.session.email}); // customer was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
}

// remember to export the functions
module.exports = {
  getAllCustomers,
  getOneCustomer,
  addCustomer,
  updateCustomer,
};

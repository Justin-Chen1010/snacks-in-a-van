const mongoose = require("mongoose");

// import customer model
const Customer = mongoose.model("Customer");

// get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
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
      customerId: req.params.customerId,
    });
    if (oneCustomer === null) {
      // no customer found in database
      res.status(404);
      return res.send("Customer not found");
    }
    return res.send(oneCustomer); // customer was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// change an customer (POST)
const updateCustomer = async (req, res) => {
  try {
    const oneCustomer = await Customer.findOne({
      customerId: req.params.customerId,
    });
    if (oneCustomer === null) {
      // no customer found in database
      res.status(404);
      return res.send("Customer not found");
    }
    // actually update the customer
    Customer.updateOne({ customerId: oneCustomer.customerId });
    // db.foods.updateOne( {name: "Apple"}, {$set: {description: "Apples are cool" }}
    return res.send(oneCustomer); // customer was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

// add an customer (POST)
const addCustomer = async (req, res) => {
  // try {
  Customer.create(
    {
      customerId: 1,
      email: "ad@min.com",
      familyName: "adminson",
      givenName: "admin",
      password: "admin",
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

// remember to export the functions
module.exports = {
  getAllCustomers,
  getOneCustomer,
  updateCustomer,
  addCustomer,
};

// //*** FOOD ROUTES STARTS HERE ***//

// // get all foods
// app.get("/foods", async (req, res) => {
//     result = await Food.find(
//       {},
//       { name: true, description: true, vegan: true, _id: false }
//     );
//     res.send(result);
//   });

//   // get one food - user specifies its name
//   app.get("/foods/:name", async (req, res) => {
//     result = await Food.findOne({ name: req.params.name }, {});
//     res.send(result);
//   });

//   // insert new food into collection
//   app.get("/addBeer", async (req, res) => {
//     // using GET for web demo
//     const newFood = new Food({
//       name: "Beer",
//       description: "not really a food",
//       calories: 123,
//     });
//     await newFood
//       .save() // Promise-style error-handler
//       .then((result) => res.send(result)) // Mongo operation was successful
//       .catch((err) => res.send(err)); // operation was not successful
//   });

//   // insert new food into collection
//   app.post("/addFood", async (req, res) => {
//     // using POST for Postman demo
//     const newFood = new Food({
//       name: req.body.name,
//       photo: req.body.photo,
//       description: req.body.description,
//       vegan: req.body.vegan,
//       organic: req.body.organic,
//       calories: req.body.calories,
//       fat: req.body.fat,
//       protein: req.body.protein,
//     });
//     newFood.save((err, result) => {
//       // callback-style error-handler
//       if (err) res.send(err);
//       return res.send(result);
//     });
//   });

//   // update new food
//   app.get("/updateBeer", async (req, res) => {
//     await Food.updateOne({ name: "Beer" }, { description: "changed the beer" });
//     result = await Food.find({ name: "Beer" });
//     res.send(result);
//   });

//   // delete new food from collection
//   app.get("/deleteBeer", async (req, res) => {
//     await Food.deleteMany({ name: "Beer" });
//     result = await Food.find({}, { name: true, _id: false });
//     res.send(result);
//   });

const mongoose = require("mongoose")

// import customer model
const Customer = mongoose.model("Customer")

// get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
    return res.send(customers)
  } catch (err) {
    res.status(400)
    return res.send("Database query failed")
  }
}

// find one customer by their id
const getOneCustomer = async (req, res) => {  
    try {
        const oneCustomer = await Customer.findOne( {"customerId": req.params.customerId} )
        if (oneCustomer === null) {   // no customer found in database
            res.status(404)
            return res.send("Customer not found")
        }
        return res.send(oneCustomer)  // customer was found
    } catch (err) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

// change an customer (POST)
const updateCustomer = async (req, res) => {  
    try {
        const oneCustomer = await Customer.findOne( {"customerId": req.params.customerId} )
        if (oneCustomer === null) {   // no customer found in database
            res.status(404)
            return res.send("Customer not found")
        }
        // actually update the customer
        Customer.updateOne({ customerId: oneCustomer.customerId}, )
        // db.foods.updateOne( {name: "Apple"}, {$set: {description: "Apples are cool" }}
        return res.send(oneCustomer)  // customer was found
    } catch (err) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}

// add an customer (POST)


// remember to export the functions
module.exports = {
  getAllCustomers, getOneCustomer, updateCustomer//, addCustomer
}
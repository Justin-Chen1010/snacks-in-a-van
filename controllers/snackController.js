const mongoose = require("mongoose")

// import snack model
const Snack = mongoose.model("Snack")

// get all snacks
const getAllSnacks = async (req, res) => {
  try {
    const snacks = await Snack.find()
    return res.send(snacks)
  } catch (err) {
    res.status(400)
    return res.send("Database query failed")
  }
}

// find one snack by their id
const getOneSnack = async (req, res) => {
    try {
        const oneSnack = await Snack.findOne( {"snackId": req.params.snackId} )
        if (oneSnack === null) {   // no snack found in database
            res.status(404)
            return res.send("Snack not found")
        }
        return res.send(oneSnack)  // snack was found
    } catch (err) {     // error occurred
        res.status(400)
        return res.send("Database query failed")
    }
}


// // add an snacks (POST)
// const addSnack = async (req, res) => {  
//   try {
//       const newSnack = new Snack({
//         snackId: 1,
//         name: "Cake",
//         price: "adminson",
//         imageURL: "admin",

//       });

//       newSnack.save((err, snack) => {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log(snack);
//           return res.send(newSnack)  // snack was found
//         }
//       });
//   } catch (err) {     // error occurred
//       res.status(400)
//       return res.send("Database query failed")
//   }
// }

// add an snack (POST)
// Cappuccino, Latte, Flat white, Long black, Plain biscuit, Fancy biscuit, Small cake, Big cake
const addSnack = async (req, res) => {
  // try {
  Snack.create(
    {
      snackId: 2,
      name: "Latte",
      price: 4.5,
      imageURL: "https://images.unsplash.com/photo-1531441802565-2948024f1b22?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    },
    {
      snackId: 3,
      name: "Flat white",
      price: 4.5,
      imageURL: "https://images.unsplash.com/photo-1531441802565-2948024f1b22?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    
    },
    {
      snackId: 4,
      name: "Long black",
      price: 4.0,
      imageURL: "https://images.unsplash.com/photo-1517789439268-317443633a0b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    
    },
    {
      snackId: 5,
      name: "Plain biscuit",
      price: 3.5,
      imageURL: "https://images.unsplash.com/photo-1598977801327-b21fe652e851?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80",
    
    },
    
    {
      snackId: 6,
      name: "Fancy biscuit",
      price: 5.0,
      imageURL: "https://images.unsplash.com/photo-1588195540875-63c2be0f60ae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1415&q=80",
    
    },
    {
      snackId: 7,
      name: "Small cake",
      price: 15.9,
      imageURL: "https://images.unsplash.com/photo-1559589311-5e312c9bece1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80",
    
    },
    {
      snackId: 8,
      name: "Big cake",
      price: 45.5,
      imageURL: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1580&q=80",
    
    },
    
    
    
    (err, snack) => {
      if (err) {
        res.status(400);
        return res.send("Database query failed");
      } else {
        return res.send(snack);
      }
    }
  );
}


// remember to export the functions
module.exports = {
  getAllSnacks, getOneSnack ,addSnack//, updateSnack, addSnack
}


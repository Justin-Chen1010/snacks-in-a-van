const mongoose = require("mongoose");

// import snack model
const Snack = mongoose.model("Snack");

// get all snacks
const getAllSnacks = async (req, res) => {
  try {
    const snacks = await Snack.find().lean();
    res.render('menu', {'snacks':snacks});
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};

// find one snack by their id
const getOneSnack = async (req, res) => {
  try {
    const oneSnack = await Snack.findOne({ snackId: req.params.snackId });
    if (oneSnack === null) {
      // no snack found in database
      res.status(404);
      return res.send("Snack not found");
    }
    
    res.send(oneSnack); // snack was found
  } catch (err) {
    // error occurred
    res.status(400);
    return res.send("Database query failed");
  }
};

module.exports = {
  getAllSnacks,
  getOneSnack
};

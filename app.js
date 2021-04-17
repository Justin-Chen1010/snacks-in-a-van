const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const {Snack} = require("./snack");
const app = express();

require('./models')

// https://github.com/INFO30005-2021-SM1/project-t12-roboto
app.use(express.urlencoded({ extended: false }));

app.all("*", async (req, res) => {
    res.status(404).send("Not Found");
});

const port = 8080 // process.env.PORT || 8080

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});

// app.listen(process.env.PORT || 8080, () => {
//     console.log("The app is running!")
//     })


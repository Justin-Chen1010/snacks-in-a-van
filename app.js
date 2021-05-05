require("./models");
require('./config/customerPassport');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const customerRouter = require("./routes/customerRouter");
const vendorRouter = require("./routes/vendorRouter");
const exphbs = require("express-handlebars");
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash-plus');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));
app.use(session({secret: process.env.PASSPORT_KEY, 
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.urlencoded({extended: true}));
app.use("/vendor", vendorRouter);
app.use("/customer", customerRouter);

app.engine(
  "hbs",
  exphbs({
    defaultlayout: "main",
    extname: "hbs",
    helpers: require(__dirname + "/public/js/helpers.js").helpers,
    partialsDir: __dirname + '/views/partials/',
  })
);


app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.redirect('/customer');
});

app.get("/customer", (req, res) => {
  res.render("index");
});

// Invalid path, return status 404
app.all("*", async (req, res) => {
  res
    .status(404)
    .render("error", { errorCode: "404", message: "that route is invalid." });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`The app is listening on port ${port}!`);
});

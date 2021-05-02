require("./models");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const customerRouter = require("./routes/customerRouter");
const vendorRouter = require("./routes/vendorRouter");
const exphbs = require("express-handlebars");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/vendor", vendorRouter);
app.use("/customer", customerRouter);
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  exphbs({
    defaultlayout: "main",
    extname: "hbs",
    helpers: require(__dirname + "/public/js/helpers.js").helpers,
  })
);

app.set("view engine", "hbs");

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

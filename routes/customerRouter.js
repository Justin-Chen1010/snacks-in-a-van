const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customerController");
const vendorController = require("../controllers/vendorController");
const snackController = require("../controllers/snackController");
const orderController = require("../controllers/orderController");
const passport = require("passport");
const authenticate = require("./authenticate");
require("../config/customerPassport")(passport);

// get the available vendors
customerRouter.get("/vendors", async (req, res) =>
  vendorController.getAllVendors(req, res)
);
customerRouter.put("/discount/:orderId", authenticate.isCustomerLoggedIn, async (req, res) =>

 orderController.getonediscountorder(req, res)
);

customerRouter.get("/discount/:orderId", authenticate.isCustomerLoggedIn, async (req, res) => {
 orderController.getonediscountorder(req, res)
}
);



// get the menu: details of all snacks
customerRouter.get("/menu", async (req, res) =>
  snackController.getAllSnacks(req, res)
);

// get the details of a single snack
customerRouter.get("/menu/:snackId", async (req, res) => {
  snackController.getOneSnack(req, res);
});

// insert an order, specifying the name of the first snack and the assigned
// vendor
customerRouter.post("/orders", authenticate.isCustomerLoggedIn, async (req, res) => {
    // place order
    orderController.addOrder(req, res);
});

// Get all the orders for a given customer, the customer must be logged in
// and the requested orders page must be theirs
customerRouter.get("/orders", authenticate.isCustomerLoggedIn, async (req, res) => {
    orderController.getOrdersForCustomer(req, res);
});
// get an order detail that belongs to the customer
customerRouter.get(
  "/orders/:orderId",
  authenticate.isCustomerLoggedIn,
  snackController.getMenu,
  async (req, res) => orderController.getOneOrder(req, res)
);

// update an order that belongs to the customer
customerRouter.put("/orders/:orderId",
  authenticate.isCustomerLoggedIn,
  async (req, res) => orderController.updateOrder(req, res)
);

// insert new customer
customerRouter.post("/", async (req, res) =>
  customerController.addCustomer(req, res)
);

// get the cart page
customerRouter.get("/cart", snackController.getMenu, async (req, res) => {
  res.render("cart", {
    menu: req.menu,
    isLoggedin: req.isAuthenticated(),
  });
});

// get the account page, user must be authenticated
customerRouter.get("/account", authenticate.isCustomerLoggedIn, async (req, res) => {
  res.render("account", { email: req.session.email });
});

customerRouter.post("/account", authenticate.isCustomerLoggedIn,
  // passport.authenticate("local-update",
  // {
  //   successRedirect: "/customer/login", //redirect to the login page if sign up succeed
  //   failureFlash: true
  // }), async (req, res) => {
  //   customerController.updateCustomer(req, res);
  // }

  async (req, res) => {
    customerController.updateCustomer(req, res);
  }
);

// login page
customerRouter.get("/login", async (req, res) => {
  res.render("login", { "loginFailed": req.session.loginError })
  req.session.loginError = false;
});

customerRouter.post(
  "/login",
  passport.authenticate("local-login", {
    successReturnToOrRedirect: "/customer/cart", //redirect to cart after login if success
    failureRedirect: "/customer/login", //redirect to the login page after failed
    failureFlash: true,
    
  })
);
customerRouter.get("/signup", (req, res) => {
  res.render("signup");
});

customerRouter.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/customer/login", //redirect to the login page if sign up succeed
    failureRedirect: "/customer/signup", //redirect to the sign up page if failed
    failureFlash: true,
  })
);


// logout function, users are redirected to login after
customerRouter.post("/logout", function (req, res) {
  
  req.logout();
  req.flash("");
  res.redirect("/customer/login");
});

module.exports = customerRouter;

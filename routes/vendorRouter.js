const express = require("express");
const vendorRouter = express.Router();
const snackController = require("../controllers/snackController");
const vendorController = require("../controllers/vendorController");
const passport = require('passport');
const authenticate = require("./authenticate");
const orderController = require("../controllers/orderController");

require('../config/vendorPassport')(passport);

vendorRouter.get("/", (req, res) =>  {
  res.redirect("/vendor/home")
});

vendorRouter.get("/signup", (req, res) => {
  res.render('vendor/signup', {vendorName: req.session.vendorName, layout:"vendormain.hbs"});
});


// vendorRouter.get("/account", async (req, res) => {
//   res.render("vendor/account", { vendorName: req.session.vendorName, layout:"vendormain.hbs" })
// });


// vendorRouter.post("/account", passport.authenticate('local-update-password',{

//   successRedirect : '/vendor/login', // redirect to the homepage
//   failureRedirect : '/vendor/update', // redirect back to the login page if there is an error
//   failureFlash : true // allow flash messages

// }));

vendorRouter.get("/account", authenticate.isVendorLoggedIn, async (req, res) => {
  res.render("vendor/account", { vendorName: req.session.vendorName, layout:"vendormain.hbs" })
});




vendorRouter.post("/account", authenticate.isVendorLoggedIn, 


  
    //  successRedirect: "/vendor/login", //redirect to the login page if sign up succeed
    //  failureRedirect : '/vendor/account',
    //  failureFlash: true},
  // }), async (req, res) => {
  //   customerController.updateCustomer(req, res);
  // }
  async (req, res) => {
    vendorController.updateVendor(req, res);
    // res.render("vendor/account", { layout:"vendormain.hbs" });
  }
);

vendorRouter.get("/forgot-password", (req, res) => {
//{message: req.session.message,
if (req.session.vendoremail!==req.body.vendoremail){
  req.flash("message","email not found");
}
  res.render('vendor/passwordManagement',{layout:"vendormain.hbs"});

});



vendorRouter.get("/reset-password", (req, res) => {

  res.render('vendor/resetPassword',{layout:"vendormain.hbs"});
  

});



vendorRouter.get("/home", async (req, res) => {
  res.render("vendor/home", {layout:"vendormain.hbs"});
});
// vendorRouter.get("/signup", (req, res) => {
//   res.render('vendor/signup',{layout:"vendormain.hbs"});
// // });
// vendorRouter.post('/signup', passport.authenticate('local-signup', {
//   successRedirect : '/', // redirect to the homepage
//   failureRedirect : '/vendor/signup/', // redirect to signup page
//   failureFlash : true // allow flash messages
// }));
// POST login form -- authenticate user
// http:localhost:5000/user/login


vendorRouter.post("/forgot-password", passport.authenticate('local-password-management',{
  
  successRedirect : '/vendor/reset-password', // redirect to the homepage
  failureRedirect : '/vendor/forgot-password', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages

}));

vendorRouter.get("/login", async (req, res) => {
  res.render("vendor/login", { "vendorLoginFailed" : req.session.vendorLoginErr, layout:"vendormain.hbs" });
  req.session.vendorLoginErr = false;
});

vendorRouter.post('/login', passport.authenticate('vendor-login', {
  successRedirect : '/vendor/home', // redirect to the homepage
  failureRedirect : '/vendor/login', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages
  
}));

vendorRouter.post('/signup', passport.authenticate('local-signup-vendor', {
  successRedirect : '/vendor/login', // redirect to the homepage
  failureRedirect : '/vendor/signup', // redirect back to the login page if there is an error
  failureFlash : true // allow flash messages
  
}));

// logout function, users are redirected to login after
vendorRouter.post("/logout", function (req, res) {
  
  req.logout();
  req.flash("");
  res.redirect("/vendor/login");
});




// get the available vendors
vendorRouter.get("/location", authenticate.isVendorLoggedIn, async (req, res) => {
  res.render("vendor/location", {layout:"vendormain.hbs"});
});

// get outstanding ('preparing') orders for a vendor, can query status
// ?status=preparing is default, but status=fulfilled or completed
vendorRouter.get("/orders", authenticate.isVendorLoggedIn, async (req, res) => {
  orderController.getOrdersForVendor(req, res);
});

vendorRouter.get("/orders/:orderId",
  authenticate.isVendorLoggedIn,
  snackController.getMenu,
  orderController.getOrderingCustomer,
  async (req, res) => {
    orderController.getOneOrderForVendor(req, res);
});

// update the status of an order
vendorRouter.put("/orders/:orderId", authenticate.isVendorLoggedIn,
  async (req, res) => orderController.updateOrder(req, res)
);

// mark item as fulfilled
// vendorRouter.put("/orders/:orderId/status", authenticate.isVendorLoggedIn, (req, res) => {
    
//   vendorController.markOrderAsFulfilled(req, res);
    
// });

// set van status
vendorRouter.put("/status", authenticate.isVendorLoggedIn, async (req, res) =>
  vendorController.updateVanStatus(req, res)
);

vendorRouter.get("/status", authenticate.isVendorLoggedIn, async (req, res) => {
  vendorController.getOneVendor(req, res);
}
);

// // create new vendor
// vendorRouter.post("/", (req, res) => vendorController.addVendor(req, res));

module.exports = vendorRouter;

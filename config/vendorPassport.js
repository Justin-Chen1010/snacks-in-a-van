// Code taken from foodbuddy app, provided by INFO30005 Faculty 2021
// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;

// our user model
const Vendor = require('../models/vendor');

module.exports = function(passport) {

    // strategy to login
    // this method only takes in username and password, and the field names
    // should match of those in the login form
    
    
    passport.use(
        "local-password-management",
        new LocalStrategy({ 
        usernameField:"vendorEmail",
        passwordField: "vendorConfirmEmail",
        passReqToCallback: true},

        function(req, vendorEmail, vendorConfirmEmail,done){
            process.nextTick(function() {
            Vendor.findOne({vendorEmail: vendorEmail }, function(err, user){
                req.session.message=null;
                if (err){
                
                    return done(err);
                }
                if (!user){
                    console.log("no email found");
                    req.session.message='please insert an existing email';
                    
                    return done(null, false, req.flash('local-password-management', 'No email found.'));
                }
                if (vendorEmail!==vendorConfirmEmail){
                
                    //req.session.message='email and confirm email not the same';
                    
                    // false in done() indicates to the strategy that authentication has
                    // failed
                    return done(null, false, req.flash('local-password-management', 'Oops! email and confirm email not the same .'));
                } else {
                    
                
                    // for demonstration of using express-session
                    req.session.role="vendor";
                    req.session.vendorEmail= vendorEmail;
                    // done() is used by the strategy to set the authentication status with
                    // details of the user who was authenticated
                    return done(null, user, req.flash('local-password-management', 'successful email and confirm email correct and found'));
                }


            });
        });
    }));
    passport.use(
        "local-signup-vendor",
        new LocalStrategy(
          {
            usernameField: "vendorName",
            passwordField: "password",
            passReqToCallback: true,
          }, // pass the req as the first arg to the callback for verification
    
          function (req, vendorName, password, done) {
            process.nextTick(function () {
              Vendor.findOne({ vendorName: vendorName }, function (err, existingUser) {
                // search a user by the username (email in our case)
                // if user is not found or exists, exit with false indicating
                // authentication failure
                if (err) {
                  console.log(err);
                  return done(err);
                }
                if (existingUser) {
                  return done(
                    null,
                    false,
                    req.flash("signupMessage", "That vendorname is already taken.")
                  );
                } else {
                  // otherwise
                  // create a new user
                  var newUser = new Vendor();
                  
                  newUser.vendorName = req.body.vendorName;
                  
                  newUser.open =false;
                  newUser.role="vendor";
                  newUser.vendoremail= req.body.vendoremail;
        
                  newUser.lat= req.body.lat;
                  newUser.lon= req.body.lon;
                  newUser.address= req.body.address;
                  if (password === req.body.vendorconfirmPassword) {
                    newUser.password = newUser.generateHash(password);
                  } else {
                    return done(
                      null,
                      false,
                      req.flash("signupMessage", "Passwords must be identical.")
                    );
                  }
                  // and save the user
                  newUser.save(function (err) {
                    if (err) throw err;
    
                    return done(null, newUser);
                  });
    
                  // put the user's email in the session so that it can now be used for all
                  // communications between the client (browser) and the FoodBuddy app
                  req.session.vendorName = vendorName;
                }
              });
            });
          }
        )
      );



      passport.use(
        "local-update-password",
        new LocalStrategy(
          {
            usernameField: "vendorName",
            passwordField: "password",
            passReqToCallback: true,
          }, // pass the req as the first arg to the callback for verification
    
          function (req, vendorName, password, done) {
            process.nextTick(function () {
              Vendor.findOne({ vendorName: vendorName }, function (err, existingUser) {
                // search a user by the username (email in our case)
                // if user is not found or exists, exit with false indicating
                // authentication failure
                if (err) {
                  console.log(err);
                  return done(err);
                }
                if (existingUser) {
                  return done(
                    null,
                    false,
                    req.flash("signupMessage", "That vendorname is already taken.")
                  );
                } else {
                  // otherwise
                  // create a new user
                  console.log('this is user', existingUser);
                  // var newUser = new Vendor();
                  
                  // newUser.vendorName = req.body.vendorName;
                  
                  // newUser.open =false;
                  // newUser.role="vendor";
                  // newUser.vendoremail= req.body.vendoremail;
        
                  // newUser.lat= req.body.lat;
                  // newUser.lon= req.body.lon;
                  // newUser.address= req.body.address;
                  // if (password === req.body.vendorconfirmPassword) {
                  //   newUser.password = newUser.generateHash(password);
                  // } else {
                  //   return done(
                  //     null,
                  //     false,
                  //     req.flash("signupMessage", "Passwords must be identical.")
                  //   );
                  // }
                  // // and save the user
                  // newUser.save(function (err) {
                  //   if (err) throw err;
    
                  //   return done(null, newUser);
                  // });
                  return done(null, user, req.flash('loginMessage', 'Login successful'));
    
                  // put the user's email in the session so that it can now be used for all
                  // communications between the client (browser) and the FoodBuddy app
                  req.session.vendorName = vendorName;
                }
              });
            });
          }
        )
      );

    passport.use(
        'vendor-login', 
        new LocalStrategy({
        usernameField : 'vendorName', 
        passwordField : 'password',
        passReqToCallback : true}, // pass the req as the first arg to the callback for verification 

        function(req, vendorName, password, done) {
            

            process.nextTick(function() {
                // see if the user with the email exists
                Vendor.findOne({ vendorName :  vendorName }, function(err, user) {
                   
                    if (err){
                        return done(err);
                    }if (!user){
                        console.log("no user found");
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }
                    if (!user.validPassword(password)){
                        console.log("found user but invalid password")
                       
                        // false in done() indicates to the strategy that authentication has
                        // failed
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, we put the user's email in the session
                    else {
                        // in app.js, we have indicated that we will be using sessions
                        // the server uses the included modules to create and manage
                        // sessions. each client gets assigned a unique identifier and the
                        // server uses that identifier to identify different clients
                        // all this is handled by the session middleware that we are using 
                        req.session.vendorName = vendorName; // for demonstration of using express-session
                        req.session.role="vendor";

                        // done() is used by the strategy to set the authentication status with
                        // details of the user who was authenticated
                        return done(null, user, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));
}
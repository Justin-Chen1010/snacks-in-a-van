// Code taken from foodbuddy app, provided by INFO30005 Faculty 2021
// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;
const Vendor = require('../models/vendor');

module.exports = function(passport) {
    passport.use(
        "local-signup-vendor",
        new LocalStrategy(
          {
            usernameField: "vendorName",
            passwordField: "password",
            passReqToCallback: true,
          }, 
    
          function (req, vendorName, password, done) {
            process.nextTick(function () {
              Vendor.findOne({ vendorName: vendorName }, function (err, existingUser) {

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
                  var newUser = new Vendor();
                  newUser.vendorName = req.body.vendorName;
                  newUser.open =false;
                  newUser.role="vendor";
                  newUser.vendoremail= req.body.vendoremail;
                  newUser.lat= req.body.lat;
                  newUser.lon= req.body.lon;
                  newUser.address= req.body.address;

                  // check if the password is identical with confirm password
                  if (password === req.body.vendorconfirmPassword) {
                    newUser.password = newUser.generateHash(password);
                  } else {
                    return done(
                      null,
                      false,
                      req.flash("signupMessage", "Passwords must be identical.")
                    );
                  }
                  newUser.save(function (err) {
                    if (err) throw err;
    
                    return done(null, newUser);
                  });
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
        passReqToCallback : true},

        function(req, vendorName, password, done) {
            process.nextTick(function() {
                Vendor.findOne({ vendorName :  vendorName }, function(err, user) {
                   
                    if (err){
                      return done(err);
                    }
                    if (!user){
                        console.log("no user found");
                        return done(null, false, req.session.vendorLoginErr = true, req.flash('loginMessage', 'No user found.'));
                    }
                    if (!user.validPassword(password)){
                        console.log("found user but invalid password")
                        return done(null, false, req.session.vendorLoginErr = true, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    else {

                        req.session.vendorName = vendorName;
                        req.session.role = "vendor";

                        return done(null, user, req.session.vendorLoginErr = false, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));
}
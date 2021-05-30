// Code taken from foodbuddy app, provided by INFO30005 Faculty 2021
// used to create our local strategy for authenticating
// using username and password
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const LocalStrategy = require("passport-local").Strategy;
const Customer = require("../models/customer");
const Vendor = require("../models/vendor");

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
   
    done(null,user);   
  });

  passport.deserializeUser(function (user, done) {

    if (user.role === 'customer'){
      Customer.findById(user._id, function(err, user){
        done(err, user);
      });


    } else{
      Vendor.findById(user._id, function (err, user) {
      

      done(err, user);
    });
  }
});

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        process.nextTick(function () {
          Customer.findOne({ email: email }, function (err, user) {
            if (err) return done(err);
            if (!user)
              return done(
                null,
                false,
                req.session.loginError = true,
                req.flash("loginMessage", "No user found.")
              );

            if (!user.validPassword(password)) {
              return done(
                null,
                false,
                req.session.loginError = true,
                req.flash("loginMessage", "Oops! Wrong password.")
              );
            } else {

              req.session.email = email;
              req.session.userId = user.customerId;
              req.session.role = 'customer';

              return done(
                null,
                user,
                req.session.loginError = false,
                req.flash("loginMessage", "Login successful")
              );
            }
          });
        });
      }
    )
  );

  // for signup
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },

      function (req, email, password, done) {
        process.nextTick(function () {
          Customer.findOne({ email: email }, function (err, existingUser) {
            if (err) {
              console.log(err);
              return done(err);
            }
            if (existingUser) {
              console.log("existing");
              return done(
                null,
                false,
                req.flash("signupMessage", "That email is already taken.")
              );
            } else {
              var newUser = new Customer();
              newUser.customerId = uuidv4();
              newUser.email = email;
              newUser.familyName = req.body.familyName;
              newUser.givenName = req.body.givenName;
              newUser.role="customer";

               // check if the password is identical with confirm password
              if (password === req.body.confirmPassword) {
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
              req.session.email = email;
            }
          });
        });
      }
    )
  );

};

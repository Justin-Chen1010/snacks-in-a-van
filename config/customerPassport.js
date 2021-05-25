require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const LocalStrategy = require("passport-local").Strategy;
const Customer = require("../models/customer");
const Vendor = require("../models/vendor");

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
   
    done(null,user);
    // i dont understand why when i change the done(null, {'id':user._id ,'role': user.role}) , this gives me error the next time im going to log inm i wonder why, is it becasue of the two things that i have passed or is it bcause
    //in the req.session.userid something? or is it on the log in ithe customer router like passport authenticate ther
    //like if (req.session.userId === req.params.customerId) {
      // current user is authenticated and is requesting their page
    //   orderController.addOrder(req, res);
    // } else {

    //   // authenticated user, but not the right one
    //   res.redirect(`/customer/${req.session.userId}/orders`);
    
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

  // strategy to login
  // this method only takes in username and password, and the field names
  // should match of those in the login form
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      }, // pass the req as the first arg to the callback for verification
      function (req, email, password, done) {
        process.nextTick(function () {
          // see if the user with the email exists
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

              // req.session.type="customer";
              // console.log(req.session.type);
              req.session.email = email;
              req.session.userId = user.customerId;
              req.session.role = 'customer';

              // if (req.session.returnTo === "/orders") {
              //   req.session.returnTo = `/customer/${user.customerId}/orders`;
              // }
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

  // for signup, confirm password is ignored for now
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      }, // pass the req as the first arg to the callback for verification

      function (req, email, password, done) {
        process.nextTick(function () {
          Customer.findOne({ email: email }, function (err, existingUser) {
            // search a user by the username (email in our case)
            // if user is not found or exists, exit with false indicating
            // authentication failure
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
              // otherwise
              // create a new user
              var newUser = new Customer();
              newUser.customerId = uuidv4();
              newUser.email = email;
              newUser.familyName = req.body.familyName;
              newUser.givenName = req.body.givenName;
              newUser.role="customer";
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

              // put the user's email in the session so that it can now be used for all
              // communications between the client (browser) and the FoodBuddy app
              req.session.email = email;
            }
          });
        });
      }
    )
  );
};

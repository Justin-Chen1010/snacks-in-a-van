require('dotenv').config()
const { v4: uuidv4 } = require("uuid");
const LocalStrategy = require('passport-local').Strategy;
const Customer = require('../models/customer');
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;


module.exports = (passport) => {

    passport.serializeUser(function(customer, done) {
        done(null, customer._id);
    });

    passport.deserializeUser(function(_id, done) {
        Customer.findById(_id, function(err, customer) {
            done(err, customer);
        });
    });


    // strategy to login
    // this method only takes in username and password, and the field names
    // should match of those in the login form
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email', 
            passwordField: 'password',
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, email, password, done) {
            process.nextTick(function() {
                // see if the user with the email exists
                Customer.findOne({ 'email' :  email }, function(err, user) {

                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.validPassword(password)){
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    else {
                        req.session.email = email;
                        req.session.userId = user.customerId;
                        if (req.session.returnTo === '/orders') {
                            req.session.returnTo = `/customer/${user.customerId}/order`
                        }
                        return done(null, user, req.flash('loginMessage', 'Login successful'));
                    }
                });
            });

        }));



    // for signup, confirm password is ignored for now
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true }, // pass the req as the first arg to the callback for verification 
            
         function(req, email, password, done) {             
            process.nextTick( function() {
                Customer.findOne({'email': email}, function(err, existingUser) {
                    // search a user by the username (email in our case)
                    // if user is not found or exists, exit with false indicating
                    // authentication failure
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (existingUser) {
                        console.log("existing");
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    else {
                        // otherwise
                        // create a new user
                        var newUser = new Customer();
                        newUser.customerId = uuidv4();
                        newUser.email = email;
                        newUser.familyName = req.body.familyName;
                        newUser.givenName = req.body.givenName;
                        if (password === req.body.confirmPassword) {
                            newUser.password = newUser.generateHash(password);
                        }
                        else {
                           return done(null, false, req.flash('signupMessage', 'Passwords must be identical.'));
                        }

                        // and save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });

                        // put the user's email in the session so that it can now be used for all
                        // communications between the client (browser) and the FoodBuddy app
                        req.session.email=email;
                        
                    }
                });
            });
        
        }));


};
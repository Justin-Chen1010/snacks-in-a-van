// middleware to ensure user is logged in
function isCustomerLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // if not logged in, redirect to login form
    req.session.returnTo = `/customer${req.url}`;
    res.redirect('/customer/login');
}

function isVendorLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // if not logged in, redirect to login form
    req.session.returnTo = `/vendor${req.url}`;
    res.redirect('/vendor/login');
}


// export the function so that we can use
// in other parts of our all
module.exports = {
    isCustomerLoggedIn,
    isVendorLoggedIn
}
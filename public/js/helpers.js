var register = function (Handlebars) {
  var helpers = {
    // add all helpers as key: value pairs
    // format date and time to MM/DD/YYYY HH:MM
    formatDateTime: function (dateString) {
      const date = new Date(dateString);
      return (
        (date.getMonth() < 10 ? "0" : "") +
        (date.getMonth() + 1) +
        "/" +
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        "/" +
        (date.getFullYear() < 10 ? "0" : "") +
        date.getFullYear() +
        " " +
        (date.getHours() < 10 ? "0" : "") +
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes()
      );
    },

    // stringify an object
    json: function (object) {
      return JSON.stringify(object);
    },

    // converts an order (as the DB schema) to the format that the local cart
    // is stored in
    orderToCart: function (order) {
      if (!order) {
        return null;
      }
      let cart = [];
      for (let item of order.items) {
        cart.push({ snackId: String(item.snack), quantity: item.quantity });
      }
      return cart;
    },

    combineWithCart: function (order) {
      const cart = JSON.parse(sessionStorage.getItem('cart'));
      if (!cart) {
        return order;
      }
      return cart;
    },

    // returns true if (order) status is not cancelled 
    orderNotCancelled: function (status) {
      return !(status === "cancelled");
    },

    eq: function(a, b) {
      return a === b;
    },
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    // register helpers
    // for each helper defined above (we have only one, listfood)
    for (var prop in helpers) {
      // we register helper using the registerHelper method
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    // just return helpers object if we can't register helpers here
    return helpers;
  }
};

// export helpers to be used in our express app
module.exports.register = register;
module.exports.helpers = register(null);

var register = function (Handlebars) {
  var helpers = {
    // add all helpers as key: value pairs
    // format date and time to MM/DD/YYYY HH:MM
    formatDateTime: function (dateString) {
      const date = new Date(dateString);
      return (
        date.getMonth() +
        1 +
        "/" +
        date.getDate() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    },

    json: function(object) {
      return JSON.stringify(object);
    },

    orderToCart: function(order) {
      if (!order) {
        return null;
      }
      let cart = [];
      for (let item of order.items) {
        cart.push({snackId: String(item.snack), quantity: item.quantity});
      }
      return cart;
    }
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

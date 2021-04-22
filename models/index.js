const mongoose = require("mongoose");
require('dotenv').config()
CONNECTION_STRING = "mongodb+srv://<username>:<password>@cluster0.7suke.mongodb.net/snacks?retryWrites=true&w=majority"
MONGO_URL = CONNECTION_STRING.replace("<username>", process.env.MONGO_USERNAME).replace("<password>", process.env.MONGO_PASSWORD)

mongoose.connect(MONGO_URL || "mongodb://localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "snacks",
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port);
});

require("./customer");
require("./itemOrder");
require("./order");
require("./rating");
require("./snack");
require("./vendor");

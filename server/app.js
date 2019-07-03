require("dotenv").config();

const express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require("mongoose"),
  cors = require("cors"),
  routes = require("./routes/index"),
  errHandler = require("./middlewares/errHandler");

app.use(cors());
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(express.json({ limit: "2mb" }));

let DB_TARGET = "";
if (process.env.NODE_ENV == "prod") {
} else {
  DB_TARGET = process.env.MONGODB_ATLAS;
  // DB_TARGET = process.env.MONGODB_LOCAL + "-" + process.env.NODE_ENV;
}

mongoose
  .connect(DB_TARGET, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Database:", DB_TARGET);
  })
  .catch(err => {
    console.log("error");
  });

app.use("/", routes);
app.use(errHandler);

app.listen(port, () => {
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Port:", port);
});

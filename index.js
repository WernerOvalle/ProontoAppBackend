"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3999;

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/api_rest_node", { useNewUrlParser: true })
  .then(() => {
    console.log("Connection successful");
    //CREAR EL SERVIDOR

    app.listen(port, () => {
      console.log("el servidor corre bien");
    });
  })
  .catch((error) => console.log(error));

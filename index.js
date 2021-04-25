"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3999;

mongoose.set('useFindAndModify', false);//evitar que salga un mensaje en consola unicamente cuando se actualiza

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/api_rest_node", { useNewUrlParser: true })
  .then(() => {
    console.log("Connection successful");
    //CREAR EL SERVIDOR

    app.listen(port, () => {
      console.log("Server running...");
    });
  })
  .catch((error) => console.log(error));

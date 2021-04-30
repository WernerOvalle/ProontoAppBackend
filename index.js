"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = process.env.PORT || 3999;

mongoose.set('useFindAndModify', false);//evitar que salga un mensaje en consola unicamente cuando se actualiza

mongoose.Promise = global.Promise;
//usar set NODE_ENV=development para cambiar
const NODE_ENV = process.env.NODE_ENV || 'production';
require ('dotenv').config({
  path: `${NODE_ENV}.env`
});

var url = 'mongodb://'+process.env.MONGO_USERNAME+':'+process.env.MONGO_PASSWORD+'@'+process.env.MONGO_HOSTNAME+':'+process.env.MONGO_PORT+'/'+process.env.MONGO_DB;
 console.log(url)
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("Connection successful");
    //CREAR EL SERVIDOR

    app.listen(port, () => {
      console.log("Server running...");
    });
  })
  .catch((error) => console.log(error));

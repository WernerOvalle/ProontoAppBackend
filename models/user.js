"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: "String",
  lastname: "String",
  email: "String",
  role: "String",
  phone: "String",
  password: "String",
  score: "String",
  image: "String",
  status: "String",
  address: "String",
  birth: { type: Date },
  date_in: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
//lowercase y pluralizar el nombre dentro de users existiran documentos en base al schema

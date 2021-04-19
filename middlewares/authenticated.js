"use strict";
var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "key-jwt-proonto";

exports.authenticated = function (req, res, next) {
  //Comprobar si llega autorizacion
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "it's not have a authorization header",
    });
  }
  //Limpiar el token y quitar comillas
  var token = req.headers.authorization.replace(/['"]+/g, "");
  //decodificar el token
  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      //comporbar si el token ha expirado
      return res.status(404).send({
        message: "token have expired",
      });
    }
  } catch (error) {
    return res.status(404).send({
      message: "token invalid",
    });
  }

  //adjuntar usuario identificado  a request
  req.user = payload;

  //pasar a la accion

  //console.log("pasas por el middleware");
  next();
};

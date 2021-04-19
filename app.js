"use strict";

//REQUIRES
var express = require("express");
var bodyParser = require("body-parser");
//EJECUTRAR EXPRESS
var app = express();
//CARGAR ARCHIVOS DE RUTAS
var user_routes =require('./routes/user');
//MIDDELWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//CORS

//RESCRIBIR RUTAS
app.use('/api', user_routes);



//RUTA / METODO DE PRUEBA
/* app.get("/prueba", (req, res) => { */
  // return res.status(200).send("<h1>hola</h1>"); 
 /*  return res.status(200).send({
    message: "HOla mundo desd el backend con node",
  });
}); */

//EXPORTAR MODULO
module.exports = app;

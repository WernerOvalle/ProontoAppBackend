"use strict";
var validator = require("validator");
var User = require("../models/user");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
const user = require("../models/user");

var controller = {
  probando: function (req, res) {
    return res.status(200).send({
      message: "soy el metodo probando",
    });
  },
  testeando: function (req, res) {
    res.status(200).send({
      message: "soy el metodo testeando",
    });
  },

  save: function (req, res) {
    // recoger los parametros de la peticion
    var params = req.body;
    //validar los datos
    var validate_name = !validator.isEmpty(params.name);
    var validate_lastname = !validator.isEmpty(params.lastname);
    var validate_address = !validator.isEmpty(params.address);
    var validate_birth = !validator.isEmpty(params.birth);
    var validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

    if (
      validate_name &&
      validate_lastname &&
      validate_password &&
      validate_email &&
      validate_birth &&
      validate_address
    ) {
      // crea objeto de usuario
      var user = new User();

      //asignar valores al usaurios
      user.name = params.name;
      user.lastname = params.lastname;
      user.email = params.email.toLowerCase();
      user.role = "ROLE_USER";
      user.image = null;
      user.address = params.address;
      user.birth = params.birth;
      //comprobar si el usuario exite
      User.findOne({ email: user.email }, (err, issetUser) => {
        if (err) {
          return res.status(500).send({
            message: "Error checking user duplication",
          });
        }
        //si no exite
        if (!issetUser) {
          //cifrar la contraseña
          bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            //guardar usuarios
            user.save((err, userStored) => {
              if (err) {
                return res.status(500).send({
                  message: "Error saving user" + err,
                });
              }
              if (!userStored) {
                return res.status(400).send({
                  message: "User has not been saved",
                });
              }
              //devolver respuesta
              return res.status(200).send({
                status: "Success",
                user: userStored,
              }); //close save
            }); //clos bcrypt
          });
        } else {
          return res.status(500).send({
            message: "Email already exists",
          });
        }
      });
    } else {
      return res.status(400).send({
        message: "Incorrect data",
      });
    }
  },

  login: function (req, res) {
    //recoger los paremtros de la peticion
    var params = req.body;
    //validar los datos
    var validate_email =
      !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);
    //buscar usuarios que coicidan con el email

    if (validate_password && validate_email) {
      User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
        if (err) {
          return res.status(500).send({
            message: "Error trying to identify",
          });
        }

        if (!user) {
          return res.status(500).send({
            message: "User not exists",
          });
        }
        //si lo encuentra
        //comprobar la contraseña (conicidencia de email y passowr / bycrytp
        bcrypt.compare(params.password, user.password, (err, check) => {
          //si es correcto
          if (check) {
            //generar token
            if (params.gettoken == 1 || params.gettoken == "true") {
              //devolver respuesta
              return res.status(200).send({
                token: jwt.createToken(user),
              });
            } else {
              // limpiar objecto
              (user.password = undefined), (user.__v = undefined);
              //devolver respuesta
              return res.status(200).send({
                status: "success",
                user,
              });
            }
          } else {
            return res.status(200).send({
              message: "credentials are not correct",
            });
          }
        });
      });
    } else {
      return res.status(400).send({
        message: "Incorrect data",
      });
    }
  },
  update: function (req, res) {
    //crear middleware para comprobar el jwt token, ponesrelo a la ruta

    var params = req.body;
    return res.status(400).send({
      message: "success",
      params,
    });
  },
};

module.exports = controller;

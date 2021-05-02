"use strict";
var validator = require("validator");
var User = require("../models/user");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../services/jwt");
const user = require("../models/user");
var fs = require("fs");
var path = require("path");

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
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_lastname = !validator.isEmpty(params.lastname);
      var validate_address = !validator.isEmpty(params.address);
      var validate_birth = !validator.isEmpty(params.birth);
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch (e) {
      return res.status(200).send({
        message: "MISSING DATA",
      });
    }
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
              userStored.password = undefined;

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
    try {
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch (e) {
      return res.status(200).send({
        message: "MISSING DATA",
      });
    }
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
    //funcion
    function updateUser(userId, params) {
      //buscar y actualizar documento
      User.findOneAndUpdate(
        { _id: userId },
        params,
        { new: true },
        (err, userUpdated) => {
          //devolver respuesta
          if (err || !userUpdated) {
            return res.status(200).send({
              status: "error",
              message: "error when updating user",
            });
          }
          userUpdated.password = undefined;

          return res.status(200).send({
            status: "success",
            user: userUpdated,
          });
        }
      );
    }

    //Recoger datos del ususario
    var params = req.body;

    //validar datos
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_lastname = !validator.isEmpty(params.lastname);
      var validate_address = !validator.isEmpty(params.address);
      var validate_birth = !validator.isEmpty(params.birth);
      var validate_email =
        !validator.isEmpty(params.email) && validator.isEmail(params.email);
    } catch (e) {
      return res.status(200).send({
        message: "MISSING DATA",
      });
    }

    if (
      validate_name &&
      validate_lastname &&
      validate_email &&
      validate_birth &&
      validate_address
    ) {
    }
    //Eliminar propiedades innecsarias
    delete params.password;

    var userId = req.user.sub;

    //comporbar si el email es unico
    if (req.user.email != params.email) {
      User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
        if (err) {
          return res.status(500).send({
            message: "Error trying to compare the email",
          });
        }

        if (user) {
          return res.status(500).send({
            message: "User can't be modify",
          });
        } else {
          updateUser(userId, params);
        }
      });
    } else {
      updateUser(userId, params);
    }
  },

  uploadAvatar: function (req, res) {
    //configurar el modulo multiparty (md) routes/user.js

    //recoger el fichero de la peticion
    var file_name = "Avatar not saved...";

    if (Object.keys(req.files).length === 0) {
      // devolver respuesta
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }
    // conseguir el nombre y extension del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");
    //****advertencia en linux o mac  es '/'***
    var file_name = file_split[2];
    //extension del archivo
    var ext_split = file_name.split(".");
    var file_ext = ext_split[1];
    //comprobar extension (solo img)
    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "The extension is not valid",
        });
      });
    } else {
      //sacar el id del usuario identificado
      var user_Id = req.user.sub;
      //hacer update
      User.findOneAndUpdate(
        { _id: user_Id },
        {
          image: file_name,
        },
        { new: true },
        (err, userUpdated) => {
          if (err || !userUpdated) {
            return res.status(500).send({
              status: "error",
              message: "Erro to save data",
            });
          } else {
            // devolver respuesta
            return res.status(200).send({
              status: "success",
              user: userUpdated,
            });
          }
        }
      );
    }
  },
};

module.exports = controller;

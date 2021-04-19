'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth= require('../middlewares/authenticated');
var router = express.Router();


//Rutas de pruebas
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);


//Rutas de usuarios
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authenticated,UserController.update);

module.exports= router;
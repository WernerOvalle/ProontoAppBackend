'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth= require('../middlewares/authenticated');
var router = express.Router();
var multipart =  require('connect-multiparty');
var md_upload = multipart({
    uploadDir: './uploads/users'
});

//Rutas de pruebas
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);


//Rutas de usuarios
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authenticated,UserController.update);  //crear middleware para comprobar el jwt token, ponerselo a la ruta
router.post('/upload-avatar',[ md_auth.authenticated, md_upload],UserController.uploadAvatar); 

module.exports= router;
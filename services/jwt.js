'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
const { removeListener } = require('../models/user');

exports.createToken = function (user){

var payload = {
    sub: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix
}


return jwt.encode(payload, 'key-jwt-proonto');
}
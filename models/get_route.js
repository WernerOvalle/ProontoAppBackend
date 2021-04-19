'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GetRouteSchema = Schema({
    driver_id: {type: Schema.ObjectId, ref: 'User'},
    sector: 'String',
    position: 'String'
})

module.exports= mongoose.model('Get_Route', GetRouteSchema);
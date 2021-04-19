'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GetTripSchema = Schema({
    driver_id: {type: Schema.ObjectId, ref: 'User'},
    trip: 'String',
    customer_position: 'String',
    customer_id: {type: Schema.ObjectId, ref: 'User'}
})

module.exports= mongoose.model('Get_Trip', GetTripSchema);
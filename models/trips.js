'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TripSchema = Schema({
    travel_time: 'String',
    customer_id: {type: Schema.ObjectId, ref: 'User'},
    driver_id: {type: Schema.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
    start_position: 'String',
    end_position: 'String',
    total_pay: 'String',
    drive_pay: 'String',
    trip_status: 'String'
})

module.exports= mongoose.model('Trip', TripSchema);
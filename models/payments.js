'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PaymentsSchema = Schema({
    customer_id: {type: Schema.ObjectId, ref: 'User'},
    number: 'String',
    cvc: 'String',
    exp_month: 'String',
    exp_year: 'String',
    name: 'String'
})

module.exports= mongoose.model('Payment', PaymentsSchema);
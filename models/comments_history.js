'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentsHistorySchema = Schema({
    customer_id: {type: Schema.ObjectId, ref: 'User'},
    driver_id: {type: Schema.ObjectId, ref: 'User'},
    comment: 'String',
    comment_date: 'String',
    comment_time: 'String'
});

module.exports= mongoose.model('Payment', CommentsHistorySchema);
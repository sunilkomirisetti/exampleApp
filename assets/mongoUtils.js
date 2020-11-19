var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var mongoUtils = {};
var Counter = new Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true,
        default: 1
    }
},
{
    collection: 'counters'
});

Counter.plugin(uniqueValidator);

var CounterModel = mongoose.model('Counter', Counter);

mongoUtils.getNextSequence = function(oSeq, callback){
    CounterModel.findOneAndUpdate({"_id": oSeq}, {$inc: {seq: 1}}, {upsert: true}, function (error, seqRec) {
        if (!error) {
            callback((seqRec || {}).seq || 1);
        } else {
            return callback(error);
        }
    });    
}

module.exports.mongoUtils = mongoUtils;
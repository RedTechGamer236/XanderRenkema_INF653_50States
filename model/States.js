const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statesSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    }, funFacts: [{
        type: String
    }]
});

statesSchema.post('find', function(docs) {
    console.log('Documents retrieved from database: ', docs);
});

module.exports = mongoose.model('States', statesSchema);
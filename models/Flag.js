const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
    feature: {
        type: String,
        required: true
    },
    flag: {
        type: Boolean
    },
    note: {
        type: String
    }
})

module.exports = mongoose.model('Flag', flagSchema)
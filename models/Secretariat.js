const mongoose = require('mongoose');

const secretariatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passcode: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now(),
    }
})

module.exports = mongoose.model('Secretariat', secretariatSchema);
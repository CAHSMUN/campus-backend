const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
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
    school: {
        type: String,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now(),
    }
})

module.exports = mongoose.model('Sponsor', sponsorSchema);
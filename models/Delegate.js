const mongoose = require('mongoose');

// temp: just account info for now
const delegateSchema = new mongoose.Schema({
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
    isHead: {
        type: Boolean,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now(),
    }
})

module.exports = mongoose.model('Delegate', delegateSchema);
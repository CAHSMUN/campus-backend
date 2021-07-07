const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    adminEmail: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    address1: {
        type: String,
        required: true,
    },
    address2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    postal: {
        type: String,
        required: true,
    },
    sponsorPresent: {
        type: Boolean,
        required: true,
    },
    schoolPayment: {
        type: Boolean,
        required: true,
    },
    expectedSize: {
        type: String,
        required: true,
    },
    additionalInfo: {
        type: String,
    },
    enabled: {
        type: Boolean,
        required: true,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now(),
    }
})

module.exports = mongoose.model('School', schoolSchema);
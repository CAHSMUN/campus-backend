const mongoose = require('mongoose');

// temp: just account info for now
const delegateSchema = new mongoose.Schema({
    attendance: {
        type: String,
        // required: true,
    },
    capacity: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passcode: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        // required: true,
    },
    lastName: {
        type: String,
        // required: true,
    },
    grade: {
        type: String,
        // required: true,
    },
    school: {
        type: String,
        // required: true,
    },
    sex: {
        type: String,
        // required: true,
    },
    phoneNumber: {
        type: String,
        // required: true,
    },
    postal: {
        type: String,
        // required: true,
    },
    refereePosition: {
        type: String,
    },
    refereeName: {
        type: String,
    },
    ec_firstName: {
        type: String,
        // required: true,
    },
    ec_lastName: {
        type: String,
        // required: true,
    },
    ec_relationship: {
        type: String,
        // required: true,
    },
    ec_phoneNumber: {
        type: String,
        // required: true,
    },
    prefOneComm: {
        type: String,
        // required: true,
    },
    prefOneCountry: {
        type: String,
        // required: true,
    },
    prefTwoComm: {
        type: String,
        // required: true,
    },
    prefTwoCountry: {
        type: String,
        // required: true,
    },
    prefThreeComm: {
        type: String,
        // required: true,
    },
    prefThreeCountry: {
        type: String,
        // required: true,
    },
    numPrevConferences: {
        type: String,
        // required: true,
    },
    pastConferences: {
        type: String,
        // required: true,
    },
    signature: {
        type: String,
        // required: true,
    },
    paymentId: {
        type: String,
        default: ""
    },
    assignment: {
        type: String,
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now(),
    }
})

module.exports = mongoose.model('Delegate', delegateSchema);
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
      type: String,
    },
    assigned: {
      type: String,
    },
});

const committeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    countries: {
        type: [countrySchema]
    },
})

module.exports = mongoose.model('Committee', committeeSchema);

const express = require('express');
const router = express.Router();
const verify = require('../middleware/tokenVerify');
const School = require('../models/School');
const Sponsor = require('../models/Sponsor');
const Committee = require('../models/Committee');
const Delegate = require('../models/Delegate');

// export routes doesn't give the clean data,
//   just all the records required to clean the 
//   data on front-end (thru mapping auxillary data)

router.get('/delegates', verify, async (req, res) => {
    // aux data: (1) committees (2) schools
    try {
        const delegates = await Delegate.find();
        const schools = await School.find().select("name")
        const committees = await Committee.find().select("name countries")

        res.json({
            delegates,
            schools,
            committees
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

router.get('/sponsors', verify, async (req, res) => {
    // aux data: (1) schools

    try {
        const sponsors = await Sponsor.find();
        const schools = await School.find().select("name");

        res.json({
            sponsors,
            schools
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

router.get('/schools', verify, async (req, res) => {
    // no aux data needed, just schools
    
    try {
        const schools = await School.find();
        res.json(schools);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

router.get('/matrix', verify, async (req, res) => {
    // no aux data needed, just matrix

    try {
        const committees = await Committee.find();
        res.json(committees);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})



module.exports = router;
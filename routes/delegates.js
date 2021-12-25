// create delegate (registration) (email event)
// view delegate
// view all delegates
// update delegate
// delete delegate
// assign delegate


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const verify = require('../middleware/tokenVerify');
const Sponsor = require('../models/Sponsor');
const School = require('../models/School');
const Delegate = require('../models/Delegate');


// regular registration
router.post('/register/regular', async (req, res) => {
    // simple post

    const delegate = new Delegate({
        attendance: req.body.attendance, 
        capacity: req.body.capacity,
        email: req.body.email,
        passcode: req.body.passcode,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        grade: req.body.grade,
        school: req.body.school, 
        sex: req.body.sex,
        phoneNumber: req.body.phoneNumber,
        postal: req.body.postal,
        refereePosition: req.body.refereePosition,
        refereeName: req.body.refereeName,
        ec_firstName: req.body.ec_firstName,
        ec_lastName: req.body.ec_lastName,
        ec_relationship: req.body.ec_relationship,
        ec_phoneNumber: req.body.ec_phoneNumber,
        prefOneComm: req.body.prefOneComm, 
        prefOneCountry: req.body.prefOneCountry,
        prefTwoComm: req.body.prefTwoComm, 
        prefTwoCountry: req.body.prefTwoCountry,
        prefThreeComm: req.body.prefThreeComm, 
        prefThreeCountry: req.body.prefThreeCountry,
        numPrevConferences: req.body.numPrevConferences, 
        pastConferences: req.body.pastConferences, 
        signature: req.body.signature,
    });

    try {
        const newDelegate = await delegate.save();
        res.status(201).json(newDelegate);
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
})


// head delegate registration
router.post('/register/head', async (req, res) => {

    // update delegate of email `req.body.email` with all information (minus email and passcode)

})



// Get all delegates (delegates list screen)
router.get('/', verify, async (req, res) => {
    try {
        const delegates = await Delegate.find();
        res.json(delegates);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

// Get one delegate (delegate detail screen)
router.get('/:id', verify, getDelegate, async (req, res) => {
    res.json(res.delegate);
})






async function getDelegate(req, res, next) {
    let delegate;

    try {
        delegate = await Delegate.findById(req.params.id);
        if (delegate == null) {
            return res.status(404).json({
                message: `Cannot find delegate with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.delegate = delegate;
    next();
}


module.exports = router;
// create school (registration, create sponsor) (email event)
// view school
// view all schools
// update school
// delete school - cannot delete if delegates exist

// create room
// edit room
// view room
// view all rooms of school
// delete room
// lock room


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const verify = require('../middleware/tokenVerify');
const Sponsor = require('../models/Sponsor');
const School = require('../models/School');
const Delegate = require('../models/Delegate');

// register school
router.post('/register/:type', async(req, res) => {

    if(!req.params.type) return res.status(400).json({message: 'No type found'});

    const school = new School({
        name: req.body.schoolName,
        adminEmail: req.body.adminEmail,
        district: req.body.district,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        province: req.body.province,
        postal: req.body.postal,
        sponsorPresent: req.body.sponsorPresent,
        schoolPayment: req.body.schoolPayment,
        expectedSize: req.body.expectedSize,
        additionalInfo: req.body.additionalInfo,
        enabled: false,
    });
    
    try {
        const newSchool = await school.save();

        // register as sponsor
        if(req.params.type === 'sponsor') {

            // check duplicate email
            const sponsorExists = await Sponsor.findOne({email: req.body.email});
            if(sponsorExists) return res.status(400).json({ message: 'Email already in use'});

            // hash passcode
            const salt = await bcrypt.genSalt(10);
            const hashedPasscode = await bcrypt.hash(req.body.passcode, salt);
        
            const sponsor = new Sponsor({
                name: req.body.name,
                phoneNumber: req.body.phone,
                email: req.body.email,
                school: newSchool._id,
                passcode: hashedPasscode
            })
            
            try {
                const newSponsor = await sponsor.save();
                res.status(201).json(newSponsor);
            } catch (error) {
                res.status(400).json({
                    message: error.message,
                });
            }
        }


        // register as head delegate
        if(req.params.type === 'delegate') {

            // check duplicate email
            const delegateExists = await Delegate.findOne({email: req.body.email});
            if(delegateExists) return res.status(400).json({ message: 'Email already in use'});

            // hash passcode
            const salt = await bcrypt.genSalt(10);
            const hashedPasscode = await bcrypt.hash(req.body.passcode, salt);
        
            const delegate = new Delegate({
                email: req.body.email,
                school: newSchool._id,
                isHead: true,
                passcode: hashedPasscode
            })
            
            try {
                const newDelegate = await delegate.save();
                res.status(201).json(newDelegate);
            } catch (error) {
                res.status(400).json({
                    message: error.message,
                });
            }
        }
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }


});

// Get One
router.get('/:id', verify, getSchool, (req, res) => {
    res.json(res.school);
});

// Get all
router.get('/', verify, async (req, res) => {
    try {
        const schools = await School.find();
        res.json(schools);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});





async function getSchool(req, res, next) {
    let school;

    try {
        school = await School.findById(req.params.id);
        if (school == null) {
            return res.status(404).json({
                message: `Cannot find customer with id ${req.params.id}`
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

    res.school = school;
    next();
}

module.exports = router;
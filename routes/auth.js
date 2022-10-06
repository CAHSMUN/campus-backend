// login


const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');
const Secretariat = require('../models/Secretariat');
const Flag = require('../models/Flag')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Delegate = require('../models/Delegate');
const verify = require('../middleware/tokenVerify');

/*
    EDIT FLAG

    note: removed 'verify' middleware for the sake of testing
*/
router.post('/admin/flag', async (req, res) => {
    const { feature, flag, note } = req.body

    const featureFlagInDB = await Flag.findOne({ feature });
    if(!featureFlagInDB) {

        const newFeatureFlag = new Flag({
            feature,
            flag,
            note
        })
        const insertedFeatureFlag = await newFeatureFlag.save()
        res.status(201).json(insertedFeatureFlag)
    } else {
        featureFlagInDB.flag = flag
        featureFlagInDB.note = note
        const updatedFeatureFlag = await featureFlagInDB.save()
        res.json(updatedFeatureFlag)
    }
})

router.post('/admin/flag/save', async (req, res) => {
    const { isRegistrationOpen, isSchoolRegistrationOpen, conferenceYear, lateRegEnd, regRegEnd, earlyRegEnd } = req.body

    const regOpenFlag = await Flag.findOne({ feature: 'isRegistrationOpen' })
    const schoolRegOpenFlag = await Flag.findOne({ feature: 'isSchoolRegistrationOpen' })
    const conferenceYearFlag = await Flag.findOne({ feature: 'conferenceYear' })
    const earlyEndFlag = await Flag.findOne({ feature: 'earlyEndFlag' })
    const regEndFlag = await Flag.findOne({ feature: 'regEndFlag' })
    const lateEndFlag = await Flag.findOne({ feature: 'lateEndFlag' })

    regOpenFlag.flag = isRegistrationOpen
    schoolRegOpenFlag.flag = isSchoolRegistrationOpen
    conferenceYearFlag.note = conferenceYear
    earlyEndFlag.note = earlyRegEnd
    regEndFlag.note = regRegEnd
    lateEndFlag.note = lateRegEnd

    try {
        await regOpenFlag.save()
        await conferenceYearFlag.save()
        await schoolRegOpenFlag.save()
        await earlyEndFlag.save()
        await regEndFlag.save()
        await lateEndFlag.save()

        return res.status(200).json({
            message: 'successfully saved settings'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong saving settings into the database'
        })
    }
})

router.get('/admin/flag/all', async (req, res) => {
    const allFeatureFlags = await Flag.find()

    if(!allFeatureFlags) {
        return res.status(400).json({
            message: 'No existing feature flags. Refer to defaultFlags_schema and create the flags.'
        })
    }

    return res.status(200).json({
        featureFlags: allFeatureFlags
    })
})

router.get('/admin/flag/:feature', async (req, res) => {
    const { feature } = req.params

    const featureFlagInDB = await Flag.findOne({ feature })
    if(!featureFlagInDB) {
        return res.status(400).json({
            message: 'Feature flag not found'
        })
    }
    return res.status(200).json({
        flag: featureFlagInDB.flag,
        note: featureFlagInDB.note
    })
})


/*
    LOGIN
*/
router.post('/login/:type', async(req, res) => {

    const errorMessage = {
        message: 'User with credentials not found',
    }

    if(!req.params.type) return res.status(400).json({ message: 'No login type declared'});


    // SPONSOR LOGIN

    if(req.params.type === 'sponsor') {

        const userInDB = await Sponsor.findOne({email: req.body.email});
        if (!userInDB) return res.status(400).json(errorMessage);
    
        const validPass = await bcrypt.compare(req.body.passcode, userInDB.passcode)
        if(!validPass) return res.status(400).json(errorMessage);
    
        const token = jwt.sign({
            _id: userInDB._id,
            email: userInDB.email,
            role: 'SPONSOR',
            school: userInDB.school,
            name: userInDB.name,
        }, process.env.TOKEN_SECRET);
    
        return res.header('auth-token', token).send(token);
    }


    // SECRETARIAT LOGIN

    if(req.params.type === 'secretariat') {

        const userInDB = await Secretariat.findOne({email: req.body.email});
        if (!userInDB) return res.status(400).json(errorMessage);
    
        const validPass = await bcrypt.compare(req.body.passcode, userInDB.passcode)
        if(!validPass) return res.status(400).json(errorMessage);
    
        const token = jwt.sign({
            _id: userInDB._id,
            email: userInDB.email,
            role: 'SECRETARIAT',
        }, process.env.TOKEN_SECRET);
    
        return res.header('auth-token', token).send(token);
    }


    // DELEGATE LOGIN

    if(req.params.type === 'delegate') {

        const userInDB = await Delegate.findOne({email: req.body.email});
        if (!userInDB) return res.status(400).json(errorMessage);
    
        const validPass = await bcrypt.compare(req.body.passcode, userInDB.passcode) || (req.body.passcode == userInDB.passcode)
        if(!validPass) return res.status(400).json(errorMessage);
    
        const token = jwt.sign({
            _id: userInDB._id,
            email: userInDB.email,
            role: 'HEAD',
            school: userInDB.school,
        }, process.env.TOKEN_SECRET);
    
        return res.header('auth-token', token).send(token);
    }

    return res.status(400).json({message: `Login type of '${req.params.type}' is unknown`});

});



module.exports = router;